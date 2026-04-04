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
import { LocationService } from "../../services/location.service";
import { DonorService } from "../../services/donor.service";
import { DonationService } from "../../services/donation.service";
import { LocationDTO, DonorDTO, DonationDTO } from "../../models/domain.models";

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
        DatePipe
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
    donations: DonationDTO[] = [];
    loading = true;

    filterForm = this.fb.group({
        locationId: [null],
        donorId: [null],
        dateRange: [null as Date[] | null]
    });

    ngOnInit() {
        this.loadLocations();
        this.loadDonors();
        this.loadDonations(); // Load initial (all eligible)
    }

    loadLocations() {
        this.locationService.getAll().subscribe(data => {
            this.locations = [{ id: null, institutionName: "All Locations" }, ...data];
            this.cdr.detectChanges();
        });
    }

    loadDonors() {
        this.donorService.getAll().subscribe(data => {
            const mapped = data.map(d => ({ id: d.id, displayName: `${d.name} (${d.tajNumber})` }));
            this.donors = [{ id: null, displayName: "All Donors" }, ...mapped];
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
                     this.messageService.add({ severity: "info", summary: "Info", detail: "No donations found for the selected criteria." });
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load donations." });
                this.cdr.detectChanges();
            }
        });
    }

    clearFilters() {
        this.filterForm.reset();
        this.loadDonations();
    }
}
