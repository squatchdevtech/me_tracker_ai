import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FoodService, FoodEntry } from '../../../../core/services/food.service';

@Component({
  selector: 'app-food-entry-form',
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
    MatSnackBarModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Food Entry' : 'Add Food Entry' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="foodForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Food Name</mat-label>
              <input matInput formControlName="foodName" required>
              <mat-error *ngIf="foodForm.get('foodName')?.hasError('required')">
                Food name is required
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Quantity</mat-label>
                <input matInput type="number" formControlName="quantity" min="0" step="0.1">
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Unit</mat-label>
                <input matInput formControlName="unit" placeholder="e.g., grams, cups, pieces">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>When did you eat this?</mat-label>
              <input matInput type="datetime-local" formControlName="consumedAt" required>
              <mat-error *ngIf="foodForm.get('consumedAt')?.hasError('required')">
                Date and time are required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes (optional)</mat-label>
              <textarea matInput formControlName="notes" rows="3" placeholder="Any additional notes about this food entry..."></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="foodForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">{{ isEditMode ? 'Update' : 'Add' }} Entry</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .half-width {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
    
    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class FoodEntryFormComponent implements OnInit {
  foodForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  entryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.foodForm = this.fb.group({
      foodName: ['', [Validators.required]],
      quantity: [null],
      unit: [''],
      consumedAt: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.entryId = +id;
      this.loadEntry();
    } else {
      // Set default time to now
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      this.foodForm.patchValue({ consumedAt: localDateTime });
    }
  }

  private loadEntry() {
    if (this.entryId) {
      this.foodService.getFoodEntry(this.entryId).subscribe({
        next: (response) => {
          if (response.success) {
            const entry = response.data.entry;
            const consumedAt = new Date(entry.consumedAt);
            const localDateTime = new Date(consumedAt.getTime() - consumedAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            
            this.foodForm.patchValue({
              foodName: entry.foodName,
              quantity: entry.quantity,
              unit: entry.unit,
              consumedAt: localDateTime,
              notes: entry.notes
            });
          }
        },
        error: (error) => {
          console.error('Error loading food entry:', error);
          this.snackBar.open('Error loading food entry', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSubmit() {
    if (this.foodForm.valid) {
      this.isLoading = true;
      const formData = this.foodForm.value;
      
      const foodEntry: FoodEntry = {
        foodName: formData.foodName,
        quantity: formData.quantity,
        unit: formData.unit,
        consumedAt: new Date(formData.consumedAt).toISOString(),
        notes: formData.notes
      };

      const request = this.isEditMode && this.entryId
        ? this.foodService.updateFoodEntry(this.entryId, foodEntry)
        : this.foodService.createFoodEntry(foodEntry);

      request.subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open(
              `Food entry ${this.isEditMode ? 'updated' : 'created'} successfully!`,
              'Close',
              { duration: 3000 }
            );
            this.router.navigate(['/food-tracking']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.error || `Error ${this.isEditMode ? 'updating' : 'creating'} food entry`,
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/food-tracking']);
  }
}
