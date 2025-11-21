import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MoodService } from '../../../../core/services/mood.service';

interface MoodType {
  value: string;
  label: string;
  emoji: string;
}

@Component({
  selector: 'app-mood-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="mood-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ isEditMode ? 'Edit Mood Entry' : 'Add Mood Entry' }}
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="moodForm" (ngSubmit)="onSubmit()" class="mood-form">
            
            <!-- Mood Rating -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mood Rating (1-10)</mat-label>
              <mat-select formControlName="moodRating" required>
                <mat-option *ngFor="let rating of moodRatings" [value]="rating">
                  {{ rating }}/10
                </mat-option>
              </mat-select>
              <mat-error *ngIf="moodForm.get('moodRating')?.hasError('required')">
                Please select a mood rating
              </mat-error>
            </mat-form-field>

            <!-- Mood Type -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mood Type</mat-label>
              <mat-select formControlName="moodType" required>
                <mat-option *ngFor="let mood of moodTypes" [value]="mood.value">
                  {{ mood.emoji }} {{ mood.label }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="moodForm.get('moodType')?.hasError('required')">
                Please select a mood type
              </mat-error>
            </mat-form-field>

            <!-- Intensity Slider -->
            <div class="slider-container">
              <label class="slider-label">Intensity: {{ (moodForm.get('intensity')?.value * 100) | number:'1.0-0' }}%</label>
              <mat-slider
                formControlName="intensity"
                min="0"
                max="1"
                step="0.1"
                discrete
                class="full-width">
                <input matSliderThumb>
              </mat-slider>
            </div>

            <!-- Duration -->
            <div class="duration-container">
              <mat-form-field appearance="outline" class="duration-input">
                <mat-label>Duration (minutes)</mat-label>
                <input matInput type="number" formControlName="durationMinutes" min="1">
              </mat-form-field>
            </div>

            <!-- Start Time -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>When did this start?</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startedAt" required>
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
              <mat-error *ngIf="moodForm.get('startedAt')?.hasError('required')">
                Please select when this mood started
              </mat-error>
            </mat-form-field>

            <!-- End Time (optional) -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>When did this end? (optional)</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endedAt">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <!-- Triggers -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>What might have caused this mood?</mat-label>
              <textarea matInput formControlName="triggers" rows="3" 
                placeholder="e.g., Good conversation with friend, sunny weather, work stress..."></textarea>
            </mat-form-field>

            <!-- Notes -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Additional notes</mat-label>
              <textarea matInput formControlName="notes" rows="3" 
                placeholder="Any additional thoughts or details about how you're feeling..."></textarea>
            </mat-form-field>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" mat-button routerLink="/mood-tracking" class="cancel-button">
                Cancel
              </button>
              <button type="submit" mat-raised-button color="primary" 
                [disabled]="moodForm.invalid || isSubmitting" class="submit-button">
                <mat-spinner *ngIf="isSubmitting" diameter="20" class="button-spinner"></mat-spinner>
                <mat-icon *ngIf="!isSubmitting">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                {{ isEditMode ? 'Update Entry' : 'Add Entry' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mood-form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .mood-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .slider-container {
      margin: 16px 0;
    }
    
    .slider-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .duration-container {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    .duration-input {
      flex: 1;
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .cancel-button {
      color: #666;
    }
    
    .submit-button {
      min-width: 140px;
      position: relative;
    }
    
    .button-spinner {
      margin-right: 8px;
    }
    
    .submit-button mat-icon {
      margin-right: 8px;
    }
    
    .submit-button:disabled {
      opacity: 0.6;
    }
    
    mat-form-field {
      margin-bottom: 8px;
    }
    
    .mat-mdc-form-field-error {
      font-size: 12px;
    }
  `]
})
export class MoodEntryFormComponent implements OnInit {
  moodForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  entryId: number | null = null;

  moodRatings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  moodTypes: MoodType[] = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'tired', label: 'Tired', emoji: '😴' },
    { value: 'stressed', label: 'Stressed', emoji: '😤' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'irritable', label: 'Irritable', emoji: '😤' },
    { value: 'focused', label: 'Focused', emoji: '😌' },
    { value: 'confused', label: 'Confused', emoji: '😵' }
  ];

  constructor(
    private fb: FormBuilder,
    private moodService: MoodService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.moodForm = this.fb.group({
      moodRating: ['', Validators.required],
      moodType: ['', Validators.required],
      intensity: [0.5],
      durationMinutes: [null],
      startedAt: ['', Validators.required],
      endedAt: [''],
      triggers: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.entryId = +params['id'];
        this.loadMoodEntry();
      } else {
        // Set default start time to now
        this.moodForm.patchValue({
          startedAt: new Date()
        });
      }
    });
  }

  private loadMoodEntry() {
    if (this.entryId) {
      this.moodService.getMoodEntry(this.entryId).subscribe({
        next: (response) => {
          if (response.success) {
            const entry = response.data;
            this.moodForm.patchValue({
              moodRating: entry.moodRating,
              moodType: entry.moodType,
              intensity: entry.intensity || 0.5,
              durationMinutes: entry.durationMinutes,
              startedAt: new Date(entry.startedAt),
              endedAt: entry.endedAt ? new Date(entry.endedAt) : null,
              triggers: entry.triggers || '',
              notes: entry.notes || ''
            });
          }
        },
        error: (error) => {
          console.error('Error loading mood entry:', error);
          this.router.navigate(['/mood-tracking']);
        }
      });
    }
  }

  onSubmit() {
    if (this.moodForm.valid) {
      this.isSubmitting = true;
      
      const formData = {
        ...this.moodForm.value,
        startedAt: this.moodForm.value.startedAt.toISOString(),
        endedAt: this.moodForm.value.endedAt ? this.moodForm.value.endedAt.toISOString() : null
      };

      const request = this.isEditMode 
        ? this.moodService.updateMoodEntry(this.entryId!, formData)
        : this.moodService.createMoodEntry(formData);

      request.subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/mood-tracking']);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error saving mood entry:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}

