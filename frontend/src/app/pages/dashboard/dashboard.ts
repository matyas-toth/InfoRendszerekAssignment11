import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { AuthService } from "../../services/auth.service";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-dashboard",
    imports: [ButtonModule, CardModule],
    templateUrl: "./dashboard.html",
    styleUrl: "./dashboard.css",
})
export class DashboardComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    logout(): void {
        this.authService.logout();
        this.messageService.add({
            severity: "info",
            summary: "Logged Out",
            detail: "You have been logged out.",
        });
    }
}
