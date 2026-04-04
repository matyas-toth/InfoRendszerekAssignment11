import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Donation } from "../entity/Donation";
import { Donor } from "../entity/Donor";
import { Location } from "../entity/Location";
import { isValidTaj } from "../util/taj-validator";

export class DonationController extends BaseController<Donation> {
    repository = AppDataSource.getRepository(Donation);
    locationRepository = AppDataSource.getRepository(Location);
    donorRepository = AppDataSource.getRepository(Donor);

    create = async (req: Request, res: Response) => {
        try {
            const {
                locationId,
                donorId,
                donationDate,
                eligible,
                ineligibilityReason,
                doctorName,
                directed,
                patientName,
                patientTajNumber
            } = req.body;

            // Basic validation
            if (!locationId || !donorId || eligible === undefined || !doctorName || directed === undefined) {
                return this.handleError(res, null, 400, "Missing required fields.");
            }

            // Location validation
            const location = await this.locationRepository.findOneBy({ id: locationId });
            if (!location) {
                return this.handleError(res, null, 404, "Location not found.");
            }
            if (!location.active) {
                return this.handleError(res, null, 400, "Location is not currently active for donations.");
            }

            // Donor validation
            const donor = await this.donorRepository.findOneBy({ id: donorId });
            if (!donor) {
                return this.handleError(res, null, 404, "Donor not found.");
            }

            // Eligibility logic
            if (!eligible) {
                if (!ineligibilityReason) {
                    return this.handleError(res, null, 400, "Ineligibility reason is required when not eligible.");
                }
                if (directed) {
                    return this.handleError(res, null, 400, "Ineligible donors cannot make directed donations.");
                }
            }

            // Directed logic
            if (directed) {
                if (!patientName || !patientTajNumber) {
                    return this.handleError(res, null, 400, "Patient name and TAJ number are required for directed donations.");
                }
                if (!isValidTaj(patientTajNumber)) {
                    return this.handleError(res, null, 400, "Invalid patient TAJ number.");
                }
            }

            const entity = this.repository.create({
                location,
                donor,
                donationDate: donationDate || new Date(),
                eligible,
                ineligibilityReason: eligible ? null : ineligibilityReason,
                doctorName,
                directed: eligible ? directed : false,
                patientName: directed ? patientName : null,
                patientTajNumber: directed ? patientTajNumber : null,
            });

            const saved = await this.repository.save(entity);
            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getFiltered = async (req: Request, res: Response) => {
        try {
            const { locationId, donorId, startDate, endDate } = req.query;

            const queryBuilder = this.repository.createQueryBuilder('donation')
                .leftJoinAndSelect('donation.location', 'location')
                .leftJoinAndSelect('donation.donor', 'donor')
                .where('donation.eligible = :eligible', { eligible: true });

            if (locationId) {
                queryBuilder.andWhere('location.id = :locationId', { locationId });
            }

            if (donorId) {
                queryBuilder.andWhere('donor.id = :donorId', { donorId });
            }

            if (startDate) {
                queryBuilder.andWhere('donation.donationDate >= :startDate', { startDate });
            }

            if (endDate) {
                queryBuilder.andWhere('donation.donationDate <= :endDate', { endDate });
            }

            const donations = await queryBuilder.getMany();
            res.json(donations);
        } catch (err) {
            this.handleError(res, err);
        }
    };
}
