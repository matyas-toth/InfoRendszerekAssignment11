import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthResponseDTO, LoginDTO, RegisterDTO, UserDTO } from "../models/auth.models";

@Injectable({ providedIn: "root" })
export class UserService {
    private readonly API_URL = "http://localhost:3000/api/users";

    constructor(private http: HttpClient) {}

    register(data: RegisterDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(this.API_URL, data);
    }

    login(data: LoginDTO): Observable<AuthResponseDTO> {
        return this.http.post<AuthResponseDTO>(`${this.API_URL}/login`, data);
    }

    getAll(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(this.API_URL);
    }

    getOne(id: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${this.API_URL}/${id}`);
    }
}
