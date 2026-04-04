import { Routes } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { LoginComponent } from "./pages/login/login";
import { RegisterComponent } from "./pages/register/register";
import { DashboardComponent } from "./pages/dashboard/dashboard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [() => inject(AuthService).preventAuthAccess()],
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: [() => inject(AuthService).preventAuthAccess()],
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [() => inject(AuthService).preventGuestAccess()],
    },
    {
        path: "**",
        redirectTo: "login",
    },
];
