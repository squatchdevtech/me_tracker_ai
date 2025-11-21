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
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../core/services/auth.service';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-profile',
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
    MatNativeDateModule,
    MatDividerModule
  ],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>Profile Settings</h1>
        <button mat-button routerLink="/dashboard" class="back-button">
          <mat-icon>arrow_back</mat-icon>
          Back to Dashboard
        </button>
      </div>

      <div class="profile-content">
        <!-- Profile Information -->
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>Personal Information</mat-card-title>
            <mat-card-subtitle>Update your account details</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
              
              <!-- Name Fields -->
              <div class="name-fields">
                <mat-form-field appearance="outline" class="name-field">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" required>
                  <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                    First name is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="name-field">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" required>
                  <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                    Last name is required
                  </mat-error>
                </mat-form-field>
              </div>

              <!-- Email -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" required>
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <!-- Date of Birth -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date of Birth</mat-label>
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
                <button type="button" mat-button (click)="resetForm()" [disabled]="isSubmitting">
                  Reset
                </button>
                <button type="submit" mat-raised-button color="primary" 
                  [disabled]="profileForm.invalid || isSubmitting || !profileForm.dirty" class="save-button">
                  <mat-spinner *ngIf="isSubmitting" diameter="20" class="button-spinner"></mat-spinner>
                  <mat-icon *ngIf="!isSubmitting">save</mat-icon>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Account Information -->
        <mat-card class="account-card">
          <mat-card-header>
            <mat-card-title>Account Information</mat-card-title>
            <mat-card-subtitle>Your account details and statistics</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="account-info">
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div class="info-content">
                  <h4>Account ID</h4>
                  <p>{{ currentUser?.id }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>email</mat-icon>
                <div class="info-content">
                  <h4>Email Address</h4>
                  <p>{{ currentUser?.email }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>calendar_today</mat-icon>
                <div class="info-content">
                  <h4>Member Since</h4>
                  <p>{{ formatDate(currentUser?.createdAt) }}</p>
                </div>
              </div>
              
              <div class="info-item">
                <mat-icon>update</mat-icon>
                <div class="info-content">
                  <h4>Last Updated</h4>
                  <p>{{ formatDate(currentUser?.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Danger Zone -->
        <mat-card class="danger-card">
          <mat-card-header>
            <mat-card-title>Danger Zone</mat-card-title>
            <mat-card-subtitle>Irreversible actions</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="danger-actions">
              <div class="danger-item">
                <div class="danger-info">
                  <h4>Change Password</h4>
                  <p>Update your account password</p>
                </div>
                <button mat-button color="warn" (click)="changePassword()">
                  <mat-icon>lock</mat-icon>
                  Change Password
                </button>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="danger-item">
                <div class="danger-info">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button mat-button color="warn" (click)="deleteAccount()">
                  <mat-icon>delete_forever</mat-icon>
                  Delete Account
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .header h1 {
      margin: 0;
    }
    
    .back-button {
      color: #666;
    }
    
    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .profile-form {
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
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .save-button {
      min-width: 140px;
      position: relative;
    }
    
    .button-spinner {
      margin-right: 8px;
    }
    
    .save-button mat-icon {
      margin-right: 8px;
    }
    
    .account-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .info-item mat-icon {
      color: #3f51b5;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .info-content h4 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 16px;
    }
    
    .info-content p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .danger-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .danger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #fff5f5;
      border-radius: 8px;
      border: 1px solid #ffebee;
    }
    
    .danger-info h4 {
      margin: 0 0 4px 0;
      color: #c62828;
      font-size: 16px;
    }
    
    .danger-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .danger-item button {
      font-weight: 500;
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
      
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
      
      .danger-item {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.currentUser = response.data;
          this.profileForm.patchValue({
            firstName: this.currentUser?.firstName || '',
            lastName: this.currentUser?.lastName || '',
            email: this.currentUser?.email || '',
            dateOfBirth: this.currentUser?.dateOfBirth ? new Date(this.currentUser.dateOfBirth) : null
          });
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.profileForm.dirty) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        ...this.profileForm.value,
        dateOfBirth: this.profileForm.value.dateOfBirth ? 
          this.profileForm.value.dateOfBirth.toISOString().split('T')[0] : null
      };

      this.authService.updateProfile(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Profile updated successfully!';
            this.currentUser = response.data;
            this.profileForm.markAsPristine();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = response.error || 'Failed to update profile. Please try again.';
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Profile update error:', error);
          this.errorMessage = error.error?.error || 'Failed to update profile. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm() {
    this.profileForm.patchValue({
      firstName: this.currentUser?.firstName || '',
      lastName: this.currentUser?.lastName || '',
      email: this.currentUser?.email || '',
      dateOfBirth: this.currentUser?.dateOfBirth ? new Date(this.currentUser.dateOfBirth) : null
    });
    this.profileForm.markAsPristine();
    this.errorMessage = '';
    this.successMessage = '';
  }

  changePassword() {
    // TODO: Implement change password functionality
    console.log('Change password clicked');
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      // TODO: Implement delete account functionality
      console.log('Delete account clicked');
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
}

