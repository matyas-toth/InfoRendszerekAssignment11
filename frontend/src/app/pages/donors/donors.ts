import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ToolbarModule } from "primeng/toolbar";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { DonorService } from "../../services/donor.service";
import { DonorDTO } from "../../models/domain.models";
import { tajValidator } from "../../util/taj-validator";

@Component({
    selector: "app-donors",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ToolbarModule,
        SelectModule,
        DatePickerModule,
        DatePipe
    ],
    templateUrl: "./donors.html",
    styleUrl: "./donors.css",
})
export class DonorsComponent implements OnInit {
    authService = inject(AuthService);
    private donorService = inject(DonorService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    donors: DonorDTO[] = [];
    donorDialog = false;
    isEdit = false;
    submitted = false;
    loading = true;

    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];

    donorForm = this.fb.group({
        id: [0],
        name: ["", Validators.required],
        gender: ["", Validators.required],
        nationality: ["", Validators.required],
        birthPlace: ["", Validators.required],
        birthDate: [null as Date | null, Validators.required],
        address: ["", Validators.required],
        tajNumber: ["", [Validators.required, tajValidator()]],
    });

    ngOnInit() {
        this.loadDonors();
    }

    loadDonors() {
        this.loading = true;
        this.donorService.getAll().subscribe({
            next: (data) => {
                this.donors = data.map(d => ({...d, birthDate: new Date(d.birthDate)}));
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.showError(err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openNew() {
        this.isEdit = false;
        this.submitted = false;
        this.donorForm.reset({ id: 0 });
        this.donorDialog = true;
    }

    editDonor(donor: DonorDTO) {
        this.isEdit = true;
        this.submitted = false;
        this.donorForm.patchValue({...donor, birthDate: new Date(donor.birthDate)});
        this.donorDialog = true;
    }

    hideDialog() {
        this.donorDialog = false;
        this.submitted = false;
    }

    saveDonor() {
        this.submitted = true;
        if (this.donorForm.invalid) return;

        const data = this.donorForm.value as DonorDTO;

        if (this.isEdit) {
            this.donorService.update(data).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Successful", detail: "Donor Updated" });
                    this.loadDonors();
                    this.hideDialog();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.showError(err);
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.donorService.create(data).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Successful", detail: "Donor Created" });
                    this.loadDonors();
                    this.hideDialog();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.showError(err);
                    this.cdr.detectChanges();
                }
            });
        }
    }

    deleteDonor(donor: DonorDTO) {
        if (confirm(`Are you sure you want to delete ${donor.name}?`)) {
            this.donorService.delete(donor.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Successful", detail: "Donor Deleted" });
                    this.loadDonors();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.showError(err);
                    this.cdr.detectChanges();
                }
            });
        }
    }

    showError(err: any) {
        this.messageService.add({ severity: "error", summary: "Error", detail: err.error?.error || "Operation failed" });
    }
}
