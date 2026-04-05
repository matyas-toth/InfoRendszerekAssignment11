import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from "primeng/card";
import { MessageService } from "primeng/api";
import { LocationService } from "../../services/location.service";
import { DonorService } from "../../services/donor.service";
import { DonationService } from "../../services/donation.service";
import { LocationDTO, DonorDTO } from "../../models/domain.models";
import { tajValidator } from "../../util/taj-validator";

@Component({
    selector: "app-add-donation",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectModule,
        DatePickerModule,
        InputTextModule,
        TextareaModule,
        CheckboxModule,
        CardModule
    ],
    templateUrl: "./add-donation.html",
    styleUrl: "./add-donation.css",
})
export class AddDonationComponent implements OnInit {
    private locationService = inject(LocationService);
    private donorService = inject(DonorService);
    private donationService = inject(DonationService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private router = inject(Router);

    locations: LocationDTO[] = [];
    donors: DonorDTO[] = [];
    submitted = false;
    loading = false;

    donationForm = this.fb.group({
        locationId: [null as number | null, Validators.required],
        donorId: [null as number | null, Validators.required],
        donationDate: [new Date(), Validators.required],
        doctorName: ["", Validators.required],
        eligible: [true],
        ineligibilityReason: [""],
        directed: [false],
        patientName: [""],
        patientTajNumber: ["", [tajValidator()]]
    });

    ngOnInit() {
        // Load active locations
        this.locationService.getAll().subscribe(data => {
            this.locations = data.filter(loc => loc.active);
        });

        // Load all donors
        this.donorService.getAll().subscribe(data => {
            this.donors = data.map(d => ({ ...d, displayName: `${d.name} (${d.tajNumber})` }));
        });

        // Subscribe to value changes to manage dynamic validation
        this.donationForm.get('eligible')?.valueChanges.subscribe(eligible => {
            if (eligible) {
                this.donationForm.get('ineligibilityReason')?.setValidators(null);
                this.donationForm.get('directed')?.enable();
            } else {
                this.donationForm.get('ineligibilityReason')?.setValidators([Validators.required]);
                this.donationForm.get('directed')?.setValue(false);
                this.donationForm.get('directed')?.disable();
            }
            this.donationForm.get('ineligibilityReason')?.updateValueAndValidity();
        });

        this.donationForm.get('directed')?.valueChanges.subscribe(directed => {
            if (directed) {
                this.donationForm.get('patientName')?.setValidators([Validators.required]);
                this.donationForm.get('patientTajNumber')?.setValidators([Validators.required, tajValidator()]);
            } else {
                this.donationForm.get('patientName')?.setValidators(null);
                this.donationForm.get('patientTajNumber')?.setValidators([tajValidator()]);
            }
            this.donationForm.get('patientName')?.updateValueAndValidity();
            this.donationForm.get('patientTajNumber')?.updateValueAndValidity();
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.donationForm.invalid) {
            this.donationForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const formValue = this.donationForm.getRawValue();

        this.donationService.create(formValue as any).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Siker", detail: "Véradás rögzítve." });
                this.router.navigateByUrl('/view-donations');
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({ severity: "error", summary: "Hiba", detail: err.error?.error || "Művelet sikertelen" });
            }
        });
    }
}
