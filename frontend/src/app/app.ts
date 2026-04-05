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
    isDarkTheme = true;

    ngOnInit() {
        this.items = [
            {
                label: 'Kezdőlap',
                icon: 'pi pi-home',
                routerLink: '/dashboard'
            },
            {
                label: 'Management',
                icon: 'pi pi-database',
                items: [
                    {
                        label: 'Helyszínek',
                        icon: 'pi pi-map-marker',
                        routerLink: '/locations'
                    },
                    {
                        label: 'Donorok',
                        icon: 'pi pi-users',
                        routerLink: '/donors'
                    }
                ]
            },
            {
                label: 'Véradás',
                icon: 'pi pi-heart',
                items: [
                    {
                        label: 'Új véradás',
                        icon: 'pi pi-plus',
                        routerLink: '/add-donation'
                    },
                    {
                        label: 'Összes véradás',
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

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const html = document.querySelector('html');
        if (html) {
            if (this.isDarkTheme) {
                html.classList.add('app-dark');
            } else {
                html.classList.remove('app-dark');
            }
        }
    }
}
