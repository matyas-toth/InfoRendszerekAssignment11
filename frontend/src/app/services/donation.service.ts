import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { DonationDTO, DonationCreateDTO, DonationFilterDTO } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class DonationService {
    private readonly API_URL = "http://localhost:3000/api/donations";

    constructor(private http: HttpClient) {}

    create(data: DonationCreateDTO): Observable<DonationDTO> {
        return this.http.post<DonationDTO>(this.API_URL, data);
    }

    getFiltered(filter?: DonationFilterDTO): Observable<DonationDTO[]> {
        let params = new HttpParams();

        if (filter) {
            if (filter.locationId) {
                params = params.set('locationId', filter.locationId.toString());
            }
            if (filter.donorId) {
                params = params.set('donorId', filter.donorId.toString());
            }
            if (filter.startDate) {
                params = params.set('startDate', filter.startDate.toISOString());
            }
            if (filter.endDate) {
                params = params.set('endDate', filter.endDate.toISOString());
            }
        }

        return this.http.get<DonationDTO[]>(this.API_URL, { params });
    }
}
