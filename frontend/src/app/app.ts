import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { MenubarModule } from "primeng/menubar";
import { MenuItem, MessageService } from "primeng/api";
import { AuthService } from "./services/auth.service";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, ToastModule, MenubarModule],
    templateUrl: "./app.html",
    styleUrl: "./app.css",
})
export class App implements OnInit {
    authService = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    items: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: '/dashboard'
            },
            {
                label: 'System Management',
                icon: 'pi pi-database',
                items: [
                    {
                        label: 'Locations',
                        icon: 'pi pi-map-marker',
                        routerLink: '/locations'
                    },
                    {
                        label: 'Donors',
                        icon: 'pi pi-users',
                        routerLink: '/donors'
                    }
                ]
            },
            {
                label: 'Donations',
                icon: 'pi pi-heart',
                items: [
                    {
                        label: 'New Donation',
                        icon: 'pi pi-plus',
                        routerLink: '/add-donation'
                    },
                    {
                        label: 'View Donations',
                        icon: 'pi pi-list',
                        routerLink: '/view-donations'
                    }
                ]
            }
        ];
    }

    logout() {
        this.authService.logout();
        this.messageService.add({
            severity: "info",
            summary: "Logged Out",
            detail: "You have been logged out.",
        });
    }
}
