import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DonorDTO } from "../models/domain.models";

@Injectable({ providedIn: "root" })
export class DonorService {
    private readonly API_URL = "http://localhost:3000/api/donors";

    constructor(private http: HttpClient) {}

    getAll(): Observable<DonorDTO[]> {
        return this.http.get<DonorDTO[]>(this.API_URL);
    }

    getOne(id: number): Observable<DonorDTO> {
        return this.http.get<DonorDTO>(`${this.API_URL}/${id}`);
    }

    create(data: DonorDTO): Observable<DonorDTO> {
        return this.http.post<DonorDTO>(this.API_URL, data);
    }

    update(data: DonorDTO): Observable<DonorDTO> {
        return this.http.put<DonorDTO>(this.API_URL, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}
