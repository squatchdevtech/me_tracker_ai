import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FoodService } from '../../../../core/services/food.service';
import { MoodService } from '../../../../core/services/mood.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Welcome back, {{ currentUser?.firstName || 'User' }}!</h1>
      
      <div class="dashboard-grid">
        <!-- Quick Actions -->
        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" routerLink="/food-tracking">
                <mat-icon>restaurant</mat-icon>
                Log Food
              </button>
              <button mat-raised-button color="accent" routerLink="/mood-tracking">
                <mat-icon>mood</mat-icon>
                Log Mood
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Today's Summary -->
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Today's Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-content" *ngIf="!isLoading; else loadingTemplate">
              <div class="summary-item">
                <mat-icon>restaurant</mat-icon>
                <div>
                  <h3>{{ todayFoodEntries }} food entries</h3>
                  <p>{{ todayCalories }} calories</p>
                </div>
              </div>
              <div class="summary-item">
                <mat-icon>mood</mat-icon>
                <div>
                  <h3>{{ todayMoodEntries }} mood entries</h3>
                  <p>Average: {{ todayAvgMood }}/10</p>
                </div>
              </div>
            </div>
            <ng-template #loadingTemplate>
              <div class="loading-container">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <!-- Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list" *ngIf="!isLoading; else loadingTemplate">
              <div class="activity-item" *ngFor="let activity of recentActivity">
                <mat-icon [class]="'activity-icon ' + activity.type">{{ activity.icon }}</mat-icon>
                <div class="activity-content">
                  <p>{{ activity.description }}</p>
                  <small>{{ activity.time }}</small>
                </div>
              </div>
              <p *ngIf="recentActivity.length === 0" class="no-activity">
                No recent activity. Start tracking your food and mood!
              </p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Insights -->
        <mat-card class="insights-card">
          <mat-card-header>
            <mat-card-title>Insights</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="insights-content">
              <div class="insight-item">
                <mat-icon>trending_up</mat-icon>
                <p>Keep tracking to discover patterns between your food and mood!</p>
              </div>
              <div class="insight-item">
                <mat-icon>lightbulb</mat-icon>
                <p>Try logging your mood at different times of the day.</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-container h1 {
      margin-bottom: 24px;
      color: #333;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .quick-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .quick-actions button {
      flex: 1;
      min-width: 120px;
    }
    
    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .summary-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .summary-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3f51b5;
    }
    
    .summary-item h3 {
      margin: 0;
      font-size: 18px;
    }
    
    .summary-item p {
      margin: 0;
      color: #666;
    }
    
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .activity-item:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .activity-icon.food {
      color: #4caf50;
    }
    
    .activity-icon.mood {
      color: #ff9800;
    }
    
    .activity-content p {
      margin: 0;
      font-size: 14px;
    }
    
    .activity-content small {
      color: #666;
      font-size: 12px;
    }
    
    .no-activity {
      text-align: center;
      color: #666;
      font-style: italic;
    }
    
    .insights-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .insight-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .insight-item mat-icon {
      color: #ff9800;
      margin-top: 2px;
    }
    
    .insight-item p {
      margin: 0;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isLoading = true;
  todayFoodEntries = 0;
  todayCalories = 0;
  todayMoodEntries = 0;
  todayAvgMood = 0;
  recentActivity: any[] = [];

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private moodService: MoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.isLoading = true;
    
    // Load today's food summary
    this.foodService.getFoodSummary('daily').subscribe({
      next: (response) => {
        if (response.success) {
          this.todayFoodEntries = response.data.summary.entryCount;
          this.todayCalories = Math.round(response.data.summary.totalCalories);
        }
      },
      error: (error) => {
        console.error('Error loading food summary:', error);
      }
    });

    // Load today's mood summary
    this.moodService.getMoodSummary('daily').subscribe({
      next: (response) => {
        if (response.success) {
          this.todayMoodEntries = response.data.summary.entryCount;
          this.todayAvgMood = response.data.summary.averageRating;
        }
      },
      error: (error) => {
        console.error('Error loading mood summary:', error);
      }
    });

    // Load recent food entries
    this.foodService.getFoodEntries(1, 5).subscribe({
      next: (response) => {
        if (response.success) {
          const foodActivities = response.data.entries.map((entry: any) => ({
            type: 'food',
            icon: 'restaurant',
            description: `Ate ${entry.foodName}`,
            time: this.formatTime(entry.consumedAt)
          }));
          
          this.recentActivity = [...this.recentActivity, ...foodActivities];
        }
      },
      error: (error) => {
        console.error('Error loading recent food entries:', error);
      }
    });

    // Load recent mood entries
    this.moodService.getMoodEntries(1, 5).subscribe({
      next: (response) => {
        if (response.success) {
          const moodActivities = response.data.entries.map((entry: any) => ({
            type: 'mood',
            icon: 'mood',
            description: `Felt ${entry.moodType} (${entry.moodRating}/10)`,
            time: this.formatTime(entry.startedAt)
          }));
          
          this.recentActivity = [...this.recentActivity, ...moodActivities];
        }
        
        // Sort by time and take the most recent 5
        this.recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        this.recentActivity = this.recentActivity.slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent mood entries:', error);
        this.isLoading = false;
      }
    });
  }

  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
