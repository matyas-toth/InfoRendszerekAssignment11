import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocationDTO } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class LocationService {
    private readonly API_URL = "http://localhost:3000/api/locations";

    constructor(private http: HttpClient) {}

    getAll(): Observable<LocationDTO[]> {
        return this.http.get<LocationDTO[]>(this.API_URL);
    }

    getOne(id: number): Observable<LocationDTO> {
        return this.http.get<LocationDTO>(`${this.API_URL}/${id}`);
    }

    create(data: LocationDTO): Observable<LocationDTO> {
        return this.http.post<LocationDTO>(this.API_URL, data);
    }

    update(data: LocationDTO): Observable<LocationDTO> {
        return this.http.put<LocationDTO>(this.API_URL, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    toggleActive(id: number): Observable<LocationDTO> {
        return this.http.patch<LocationDTO>(`${this.API_URL}/${id}/toggle`, {});
    }
}
