import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { CardModule } from "primeng/card";
import { MessageService } from "primeng/api";
import { UserService } from "../../services/user.service";
import { RegisterDTO } from "../../models/auth.models";

@Component({
    selector: "app-register",
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        MessageModule,
        CardModule,
        RouterLink,
    ],
    templateUrl: "./register.html",
    styleUrl: "./register.css",
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    loading = false;
    submitted = false;

    registerForm = this.fb.group(
        {
            firstName: ["", [Validators.required]],
            lastName: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
            confirmPassword: ["", [Validators.required]],
        },
        { validators: this.passwordMatchValidator }
    );

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get("password");
        const confirmPassword = control.get("confirmPassword");
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    isInvalid(field: string): boolean {
        const control = this.registerForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const { firstName, lastName, email, password } = this.registerForm.value;
        const data: RegisterDTO = {
            firstName: firstName!,
            lastName: lastName!,
            email: email!,
            password: password!,
        };

        this.userService.register(data).subscribe({
            next: () => {
                this.messageService.add({
                    severity: "success",
                    summary: "Sikeres regisztráció",
                    detail: "Sikeresen regisztrált! Kérjük, jelentkezzen be.",
                });
                this.router.navigateByUrl("/login");
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: "error",
                    summary: "Hiba",
                    detail: err.error?.error || "Sikertelen regisztráció.",
                });
            },
        });
    }
}
