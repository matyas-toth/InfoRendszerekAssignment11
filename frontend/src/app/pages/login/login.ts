import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { CardModule } from "primeng/card";
import { MessageService } from "primeng/api";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { LoginDTO } from "../../models/auth.models";

@Component({
    selector: "app-login",
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        MessageModule,
        CardModule,
        RouterLink,
    ],
    templateUrl: "./login.html",
    styleUrl: "./login.css",
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    loading = false;
    submitted = false;

    loginForm = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required]],
    });

    isInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const data = this.loginForm.value as LoginDTO;

        this.userService.login(data).subscribe({
            next: (response) => {
                this.authService.setToken(response.accessToken);
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: "Logged in successfully!",
                });
                this.router.navigateByUrl("/dashboard");
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: err.error?.error || "Login failed.",
                });
            },
        });
    }
}
