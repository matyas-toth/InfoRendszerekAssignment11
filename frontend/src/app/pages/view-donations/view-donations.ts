import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { TagModule } from "primeng/tag";
import { CardModule } from "primeng/card";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { CheckboxModule } from "primeng/checkbox";
import { LocationService } from "../../services/location.service";
import { DonorService } from "../../services/donor.service";
import { DonationService } from "../../services/donation.service";
import { LocationDTO, DonorDTO, DonationDTO } from "../../models/domain.models";
import { tajValidator } from "../../util/taj-validator";
import { Validators } from "@angular/forms";

@Component({
    selector: "app-view-donations",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        TagModule,
        CardModule,
        DatePipe,
        DialogModule,
        InputTextModule,
        TextareaModule,
        CheckboxModule
    ],
    templateUrl: "./view-donations.html",
    styleUrl: "./view-donations.css",
})
export class ViewDonationsComponent implements OnInit {
    private locationService = inject(LocationService);
    private donorService = inject(DonorService);
    private donationService = inject(DonationService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    locations: any[] = [];
    donors: any[] = [];
    editLocations: LocationDTO[] = [];
    editDonors: DonorDTO[] = [];
    donations: DonationDTO[] = [];
    loading = true;

    donationDialog = false;
    submitted = false;
    isEdit = false;

    filterForm = this.fb.group({
        locationId: [null],
        donorId: [null],
        dateRange: [null as Date[] | null]
    });

    donationForm = this.fb.group({
        id: [0],
        location: [null as any, Validators.required],
        donor: [null as any, Validators.required],
        donationDate: [new Date(), Validators.required],
        doctorName: ["", Validators.required],
        eligible: [true],
        ineligibilityReason: [""],
        directed: [false],
        patientName: [""],
        patientTajNumber: ["", [tajValidator()]]
    });

    ngOnInit() {
        this.loadLocations();
        this.loadDonors();
        this.loadDonations(); // Load initial (all eligible)
    }

    loadLocations() {
        this.locationService.getAll().subscribe(data => {
            this.editLocations = data.filter(loc => loc.active);
            this.locations = [{ id: null, institutionName: "Összes Helyszín" }, ...data];
            this.cdr.detectChanges();
        });
    }

    loadDonors() {
        this.donorService.getAll().subscribe(data => {
            this.editDonors = data.map(d => ({ ...d, displayName: `${d.name} (${d.tajNumber})` }));
            const mapped = data.map(d => ({ id: d.id, displayName: `${d.name} (${d.tajNumber})` }));
            this.donors = [{ id: null, displayName: "Összes Donor" }, ...mapped];
            this.cdr.detectChanges();
        });
    }

    loadDonations() {
        const filters = this.filterForm.value;
        const req: any = {};

        if (filters.locationId) req.locationId = filters.locationId;
        if (filters.donorId) req.donorId = filters.donorId;

        if (filters.dateRange && filters.dateRange.length === 2 && filters.dateRange[0] && filters.dateRange[1]) {
            req.startDate = filters.dateRange[0];
            req.endDate = filters.dateRange[1];
        } else if (filters.dateRange && filters.dateRange[0]) {
            // Setup so it queries from this day onwards
            req.startDate = filters.dateRange[0];
        }

        this.loading = true;
        this.loading = true;
        this.donationService.getFiltered(req).subscribe({
            next: (data) => {
                this.donations = data;
                this.loading = false;
                if (data.length === 0) {
                    this.messageService.add({ severity: "info", summary: "Info", detail: "Nincs találat a keresési feltételekre." });
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({ severity: "error", summary: "Hiba", detail: "A véradások betöltése sikertelen." });
                this.cdr.detectChanges();
            }
        });
    }

    clearFilters() {
        this.filterForm.reset();
        this.loadDonations();
    }

    editDonation(donation: DonationDTO) {
        this.isEdit = true;
        this.submitted = false;

        this.donationForm.patchValue({
            id: donation.id,
            location: donation.location?.id,
            donor: donation.donor?.id,
            donationDate: new Date(donation.donationDate),
            doctorName: donation.doctorName,
            eligible: donation.eligible,
            ineligibilityReason: donation.ineligibilityReason,
            directed: donation.directed,
            patientName: donation.patientName,
            patientTajNumber: donation.patientTajNumber
        });

        this.donationDialog = true;
    }

    deleteDonation(donation: DonationDTO) {
        if (confirm(`Biztosan törölni szeretnéd ezt a véradást ${donation.donor?.name}-től?`)) {
            this.loading = true;
            this.donationService.delete(donation.id!).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Siker", detail: "Véradás törölve" });
                    this.loadDonations();
                },
                error: (err: any) => {
                    this.loading = false;
                    this.messageService.add({ severity: "error", summary: "Hiba", detail: err.error?.error || "A véradás törlése sikertelen." });
                    this.cdr.detectChanges();
                }
            });
        }
    }

    hideDialog() {
        this.donationDialog = false;
        this.submitted = false;
    }

    saveDonation() {
        this.submitted = true;
        if (this.donationForm.invalid) {
            this.donationForm.markAllAsTouched();
            return;
        }

        this.loading = true;

        // Convert to properly structured payload using IDs exactly like backend expects
        const formValue = this.donationForm.getRawValue();
        const payload: any = {
            id: formValue.id,
            locationId: formValue.location,
            donorId: formValue.donor,
            donationDate: formValue.donationDate,
            doctorName: formValue.doctorName,
            eligible: formValue.eligible,
            ineligibilityReason: formValue.ineligibilityReason,
            directed: formValue.directed,
            patientName: formValue.patientName,
            patientTajNumber: formValue.patientTajNumber
        };

        this.donationService.update(payload).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Siker", detail: "Véradás szerkesztve" });
                this.hideDialog();
                this.loadDonations();
            },
            error: (err: any) => {
                this.loading = false;
                this.messageService.add({ severity: "error", summary: "Hiba", detail: err.error?.error || "A véradás szerkesztése sikertelen." });
                this.cdr.detectChanges();
            }
        });
    }
}
