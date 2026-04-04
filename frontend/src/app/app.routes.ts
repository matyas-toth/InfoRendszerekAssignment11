import { Routes } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { LoginComponent } from "./pages/login/login";
import { RegisterComponent } from "./pages/register/register";
import { DashboardComponent } from "./pages/dashboard/dashboard";
import { LocationsComponent } from "./pages/locations/locations";
import { DonorsComponent } from "./pages/donors/donors";
import { AddDonationComponent } from "./pages/add-donation/add-donation";
import { ViewDonationsComponent } from "./pages/view-donations/view-donations";

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
        path: "locations",
        component: LocationsComponent,
    },
    {
        path: "donors",
        component: DonorsComponent,
    },
    {
        path: "add-donation",
        component: AddDonationComponent,
        canActivate: [() => inject(AuthService).preventGuestAccess()],
    },
    {
        path: "view-donations",
        component: ViewDonationsComponent,
    },
    {
        path: "**",
        redirectTo: "login",
    },
];
