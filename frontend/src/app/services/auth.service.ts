import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly TOKEN_KEY = "accessToken";

    constructor(private router: Router) {}

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        this.removeToken();
        this.router.navigateByUrl("/login");
    }

    preventGuestAccess(): boolean {
        const loggedIn = this.isLoggedIn();
        if (!loggedIn) {
            this.router.navigateByUrl("/login");
        }
        return loggedIn;
    }

    preventAuthAccess(): boolean {
        const loggedIn = this.isLoggedIn();
        if (loggedIn) {
            this.router.navigateByUrl("/dashboard");
        }
        return !loggedIn;
    }
}
