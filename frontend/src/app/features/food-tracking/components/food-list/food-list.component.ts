import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FoodService, FoodEntry } from '../../../../core/services/food.service';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="food-list-container">
      <div class="header">
        <h1>Food Tracking</h1>
        <button mat-raised-button color="primary" routerLink="/food-tracking/add">
          <mat-icon>add</mat-icon>
          Add Food Entry
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <div *ngIf="!isLoading && foodEntries.length === 0" class="empty-state">
            <mat-icon>restaurant</mat-icon>
            <h3>No food entries yet</h3>
            <p>Start tracking your food intake to see patterns and insights!</p>
            <button mat-raised-button color="primary" routerLink="/food-tracking/add">
              Add Your First Entry
            </button>
          </div>

          <div *ngIf="!isLoading && foodEntries.length > 0" class="food-entries">
            <div class="food-entry" *ngFor="let entry of foodEntries">
              <div class="entry-info">
                <h3>{{ entry.foodName }}</h3>
                <p *ngIf="entry.quantity">{{ entry.quantity }} {{ entry.unit || 'servings' }}</p>
                <p class="entry-time">{{ formatDate(entry.consumedAt) }}</p>
                <p *ngIf="entry.notes" class="entry-notes">{{ entry.notes }}</p>
              </div>
              <div class="entry-actions">
                <button mat-icon-button [routerLink]="['/food-tracking/edit', entry.id]">
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
    .food-list-container {
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
    
    .food-entries {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .food-entry {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      background: #fafafa;
    }
    
    .entry-info h3 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .entry-info p {
      margin: 4px 0;
      color: #666;
      font-size: 14px;
    }
    
    .entry-time {
      font-weight: 500;
    }
    
    .entry-notes {
      font-style: italic;
    }
    
    .entry-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class FoodListComponent implements OnInit {
  foodEntries: FoodEntry[] = [];
  isLoading = true;

  constructor(
    private foodService: FoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFoodEntries();
  }

  private loadFoodEntries() {
    this.isLoading = true;
    this.foodService.getFoodEntries().subscribe({
      next: (response) => {
        if (response.success) {
          this.foodEntries = response.data.entries;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading food entries:', error);
        this.isLoading = false;
      }
    });
  }

  deleteEntry(id: number) {
    if (confirm('Are you sure you want to delete this food entry?')) {
      this.foodService.deleteFoodEntry(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadFoodEntries(); // Reload the list
          }
        },
        error: (error) => {
          console.error('Error deleting food entry:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
