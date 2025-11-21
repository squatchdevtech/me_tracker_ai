import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join Food & Mood Tracker to start your wellness journey</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            
            <!-- Name Fields -->
            <div class="name-fields">
              <mat-form-field appearance="outline" class="name-field">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
                <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                  First name is required
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="name-field">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
                <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                  Last name is required
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Email -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <!-- Password -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 8 characters long
              </mat-error>
            </mat-form-field>

            <!-- Confirm Password -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword" required>
              <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <!-- Date of Birth -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date of Birth (Optional)</mat-label>
              <input matInput [matDatepicker]="birthDatePicker" formControlName="dateOfBirth">
              <mat-datepicker-toggle matSuffix [for]="birthDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #birthDatePicker></mat-datepicker>
            </mat-form-field>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="error-message">
              <mat-icon>error</mat-icon>
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="success-message">
              <mat-icon>check_circle</mat-icon>
              {{ successMessage }}
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="submit" mat-raised-button color="primary" 
                [disabled]="registerForm.invalid || isSubmitting" class="register-button">
                <mat-spinner *ngIf="isSubmitting" diameter="20" class="button-spinner"></mat-spinner>
                <mat-icon *ngIf="!isSubmitting">person_add</mat-icon>
                {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
              </button>
            </div>

            <!-- Login Link -->
            <div class="login-link">
              <p>Already have an account? 
                <a routerLink="/login" class="login-link-text">Sign in here</a>
              </p>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .register-card {
      width: 100%;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .name-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .name-field {
      width: 100%;
    }
    
    .full-width {
      width: 100%;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #e8f5e8;
      color: #2e7d32;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-actions {
      margin-top: 24px;
    }
    
    .register-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      position: relative;
    }
    
    .button-spinner {
      margin-right: 8px;
    }
    
    .register-button mat-icon {
      margin-right: 8px;
    }
    
    .login-link {
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .login-link p {
      margin: 0;
      color: #666;
    }
    
    .login-link-text {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }
    
    .login-link-text:hover {
      text-decoration: underline;
    }
    
    mat-form-field {
      margin-bottom: 8px;
    }
    
    .mat-mdc-form-field-error {
      font-size: 12px;
    }
    
    @media (max-width: 600px) {
      .name-fields {
        grid-template-columns: 1fr;
      }
      
      .register-container {
        padding: 10px;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        ...this.registerForm.value,
        dateOfBirth: this.registerForm.value.dateOfBirth ? 
          this.registerForm.value.dateOfBirth.toISOString().split('T')[0] : null
      };

      this.authService.register(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Account created successfully! Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.errorMessage = response.error || 'Registration failed. Please try again.';
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }
}

