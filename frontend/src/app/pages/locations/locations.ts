import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { ToolbarModule } from "primeng/toolbar";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { LocationService } from "../../services/location.service";
import { LocationDTO } from "../../models/domain.models";

@Component({
    selector: "app-locations",
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ToolbarModule,
        TagModule,
        TooltipModule,
    ],
    templateUrl: "./locations.html",
    styleUrl: "./locations.css",
})
export class LocationsComponent implements OnInit {
    authService = inject(AuthService);
    private locationService = inject(LocationService);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    locations: LocationDTO[] = [];
    locationDialog = false;
    isEdit = false;
    submitted = false;
    loading = true;

    locationForm = this.fb.group({
        id: [0],
        institutionName: ["", Validators.required],
        address: ["", Validators.required],
    });

    ngOnInit() {
        this.loadLocations();
    }

    loadLocations() {
        this.loading = true;
        this.locationService.getAll().subscribe({
            next: (data) => {
                this.locations = data;
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
        this.locationForm.reset({ id: 0, institutionName: "", address: "" });
        this.locationDialog = true;
    }

    editLocation(location: LocationDTO) {
        this.isEdit = true;
        this.submitted = false;
        this.locationForm.patchValue(location);
        this.locationDialog = true;
    }

    hideDialog() {
        this.locationDialog = false;
        this.submitted = false;
    }

    saveLocation() {
        this.submitted = true;
        if (this.locationForm.invalid) return;

        const data = this.locationForm.value as LocationDTO;

        if (this.isEdit) {
            this.locationService.update(data).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Siker", detail: "Helyszín szerkesztve" });
                    this.loadLocations();
                    this.hideDialog();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.showError(err);
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.locationService.create(data).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Siker", detail: "Helyszín létrehozva" });
                    this.loadLocations();
                    this.hideDialog();
                },
                error: (err) => this.showError(err)
            });
        }
    }

    deleteLocation(location: LocationDTO) {
        if (confirm(`Biztosan törölni szeretnéd ${location.institutionName}-t?`)) {
            this.locationService.delete(location.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Siker", detail: "Helyszín törölve" });
                    this.loadLocations();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.showError(err);
                    this.cdr.detectChanges();
                }
            });
        }
    }

    toggleActive(location: LocationDTO) {
        this.locationService.toggleActive(location.id).subscribe({
            next: () => {
                const action = location.active ? "Kikapcsolva" : "Aktiválva";
                this.messageService.add({ severity: "success", summary: "Siker", detail: `Helyszín ${action}` });
                this.loadLocations();
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.showError(err);
                this.cdr.detectChanges();
            }
        });
    }

    showError(err: any) {
        this.messageService.add({ severity: "error", summary: "Hiba", detail: err.error?.error || "Művelet sikertelen" });
    }
}
