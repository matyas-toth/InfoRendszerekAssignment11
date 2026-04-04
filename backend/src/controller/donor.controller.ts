import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Donor } from "../entity/Donor";
import { isValidTaj } from "../util/taj-validator";

export class DonorController extends BaseController<Donor> {
    repository = AppDataSource.getRepository(Donor);

    create = async (req: Request, res: Response) => {
        try {
            const donorData = req.body as Donor;
            if (!isValidTaj(donorData.tajNumber)) {
                return this.handleError(res, null, 400, "Invalid TAJ number.");
            }

            const existing = await this.repository.findOneBy({ tajNumber: donorData.tajNumber });
            if (existing) {
                return this.handleError(res, null, 409, "TAJ number already registered.");
            }

            const entity = this.repository.create(donorData);
            delete (entity as any).id;
            const saved = await this.repository.save(entity);
            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const donorData = req.body as Donor;
            if (!isValidTaj(donorData.tajNumber)) {
                return this.handleError(res, null, 400, "Invalid TAJ number.");
            }

            const entity = this.repository.create(donorData);
            const saved = await this.repository.save(entity);
            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    }
}
