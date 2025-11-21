import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MoodService } from '../../../../core/services/mood.service';

interface MoodEntry {
  id: number;
  moodRating: number;
  moodType: string;
  intensity?: number;
  durationMinutes?: number;
  startedAt: string;
  endedAt?: string;
  notes?: string;
  triggers?: string;
  createdAt: string;
}

@Component({
  selector: 'app-mood-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="mood-list-container">
      <div class="header">
        <h1>Mood Tracking</h1>
        <button mat-raised-button color="primary" routerLink="/mood-tracking/add">
          <mat-icon>add</mat-icon>
          Add Mood Entry
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <div *ngIf="!isLoading && moodEntries.length === 0" class="empty-state">
            <mat-icon>mood</mat-icon>
            <h3>No mood entries yet</h3>
            <p>Start tracking your mood to identify patterns and insights!</p>
            <button mat-raised-button color="primary" routerLink="/mood-tracking/add">
              Add Your First Entry
            </button>
          </div>

          <div *ngIf="!isLoading && moodEntries.length > 0" class="mood-entries">
            <div class="mood-entry" *ngFor="let entry of moodEntries">
              <div class="entry-info">
                <div class="mood-header">
                  <div class="mood-rating">
                    <span class="rating-number">{{ entry.moodRating }}</span>
                    <span class="rating-scale">/10</span>
                  </div>
                  <div class="mood-details">
                    <h3>{{ getMoodTypeDisplay(entry.moodType) }}</h3>
                    <p class="entry-time">{{ formatDate(entry.startedAt) }}</p>
                    <div class="mood-meta" *ngIf="entry.intensity || entry.durationMinutes">
                      <span *ngIf="entry.intensity" class="intensity">
                        Intensity: {{ (entry.intensity * 100) | number:'1.0-0' }}%
                      </span>
                      <span *ngIf="entry.durationMinutes" class="duration">
                        Duration: {{ formatDuration(entry.durationMinutes) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="mood-notes" *ngIf="entry.notes || entry.triggers">
                  <p *ngIf="entry.notes" class="notes">{{ entry.notes }}</p>
                  <p *ngIf="entry.triggers" class="triggers">
                    <strong>Triggers:</strong> {{ entry.triggers }}
                  </p>
                </div>
              </div>
              
              <div class="entry-actions">
                <button mat-icon-button [routerLink]="['/mood-tracking/edit', entry.id]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteEntry(entry.id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mood-list-container {
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
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }
    
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      margin: 16px 0 8px 0;
      color: #666;
    }
    
    .empty-state p {
      color: #999;
      margin-bottom: 24px;
    }
    
    .mood-entries {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .mood-entry {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 12px;
      background: #fafafa;
      transition: box-shadow 0.2s;
    }
    
    .mood-entry:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .mood-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .mood-rating {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-size: 24px;
      font-weight: bold;
      color: #3f51b5;
    }
    
    .rating-number {
      font-size: 32px;
    }
    
    .rating-scale {
      font-size: 16px;
      color: #666;
    }
    
    .mood-details h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 18px;
    }
    
    .mood-details p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .mood-meta {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }
    
    .mood-meta span {
      font-size: 12px;
      color: #888;
      background: #f0f0f0;
      padding: 4px 8px;
      border-radius: 12px;
    }
    
    .mood-notes {
      margin-top: 12px;
    }
    
    .mood-notes p {
      margin: 4px 0;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .notes {
      color: #555;
      font-style: italic;
    }
    
    .triggers {
      color: #666;
    }
    
    .entry-actions {
      display: flex;
      gap: 8px;
      margin-left: 16px;
    }
    
    .entry-time {
      font-weight: 500;
    }
  `]
})
export class MoodListComponent implements OnInit {
  moodEntries: MoodEntry[] = [];
  isLoading = true;

  constructor(
    private moodService: MoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMoodEntries();
  }

  private loadMoodEntries() {
    this.isLoading = true;
    this.moodService.getMoodEntries().subscribe({
      next: (response) => {
        if (response.success) {
          this.moodEntries = response.data.entries;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading mood entries:', error);
        this.isLoading = false;
      }
    });
  }

  deleteEntry(id: number) {
    if (confirm('Are you sure you want to delete this mood entry?')) {
      this.moodService.deleteMoodEntry(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadMoodEntries(); // Reload the list
          }
        },
        error: (error) => {
          console.error('Error deleting mood entry:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }

  getMoodTypeDisplay(moodType: string): string {
    const moodTypes: { [key: string]: string } = {
      'happy': '😊 Happy',
      'sad': '😢 Sad',
      'anxious': '😰 Anxious',
      'energetic': '⚡ Energetic',
      'tired': '😴 Tired',
      'stressed': '😤 Stressed',
      'calm': '😌 Calm',
      'irritable': '😤 Irritable',
      'focused': '😌 Focused',
      'confused': '😵 Confused'
    };
    return moodTypes[moodType] || moodType;
  }
}

