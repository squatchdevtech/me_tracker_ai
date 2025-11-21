import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { FoodService } from '../../../../core/services/food.service';
import { MoodService } from '../../../../core/services/mood.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BaseChartDirective
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome back, {{ currentUser?.firstName || 'User' }}!</h1>
        <div class="header-controls">
          <mat-form-field appearance="outline">
            <mat-label>View Period</mat-label>
            <mat-select [(value)]="selectedPeriod" (selectionChange)="loadDashboardData()">
              <mat-option value="daily">Today</mat-option>
              <mat-option value="weekly">This Week</mat-option>
              <mat-option value="monthly">This Month</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button (click)="loadDashboardData()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>
      
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

        <!-- Summary Stats -->
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>{{ getPeriodLabel() }} Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-content" *ngIf="!isLoading; else loadingTemplate">
              <div class="summary-item">
                <mat-icon>restaurant</mat-icon>
                <div>
                  <h3>{{ summaryStats.foodEntries }} food entries</h3>
                  <p>{{ summaryStats.calories }} calories</p>
                </div>
              </div>
              <div class="summary-item">
                <mat-icon>mood</mat-icon>
                <div>
                  <h3>{{ summaryStats.moodEntries }} mood entries</h3>
                  <p>Average: {{ summaryStats.avgMood | number:'1.1-1' }}/10</p>
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

        <!-- Mood Trend Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Mood Trend</mat-card-title>
            <mat-card-subtitle>Your mood over the last 7 days</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <canvas baseChart
                [data]="moodTrendChartData"
                [options]="moodTrendChartOptions"
                [type]="moodTrendChartType">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Food Entries Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Food Entries</mat-card-title>
            <mat-card-subtitle>Daily food entries for the last 7 days</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <canvas baseChart
                [data]="foodEntriesChartData"
                [options]="foodEntriesChartOptions"
                [type]="foodEntriesChartType">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Weekly Overview -->
        <mat-card class="overview-card">
          <mat-card-header>
            <mat-card-title>Weekly Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <canvas baseChart
                [data]="weeklyOverviewChartData"
                [options]="weeklyOverviewChartOptions"
                [type]="weeklyOverviewChartType">
              </canvas>
            </div>
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

        <!-- Top Insights -->
        <mat-card class="insights-card">
          <mat-card-header>
            <mat-card-title>Key Insights</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="insights-content" *ngIf="!isLoading; else loadingTemplate">
              <div class="insight-item" *ngFor="let insight of insights">
                <mat-icon [class]="'insight-icon ' + insight.type">{{ insight.icon }}</mat-icon>
                <div class="insight-text">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.description }}</p>
                </div>
              </div>
              <div *ngIf="insights.length === 0" class="no-insights">
                <p>Keep tracking to get personalized insights!</p>
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
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
    
    .chart-card {
      min-height: 300px;
    }
    
    .chart-card canvas {
      max-height: 250px;
    }
    
    .overview-card {
      grid-column: 1 / -1;
    }
    
    .overview-card canvas {
      max-height: 300px;
    }
    
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
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
      padding: 20px;
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
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .insight-icon {
      margin-top: 2px;
    }
    
    .insight-icon.positive {
      color: #4caf50;
    }
    
    .insight-icon.negative {
      color: #f44336;
    }
    
    .insight-icon.neutral {
      color: #ff9800;
    }
    
    .insight-text h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #333;
    }
    
    .insight-text p {
      margin: 0;
      font-size: 14px;
      line-height: 1.4;
      color: #666;
    }
    
    .no-insights {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
    }
    
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .overview-card {
        grid-column: 1;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isLoading = true;
  selectedPeriod: 'daily' | 'weekly' | 'monthly' = 'daily';
  
  summaryStats = {
    foodEntries: 0,
    calories: 0,
    moodEntries: 0,
    avgMood: 0
  };
  
  recentActivity: any[] = [];
  insights: any[] = [];

  // Mood Trend Chart
  moodTrendChartType: ChartType = 'line';
  moodTrendChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Mood Rating',
      data: [],
      borderColor: '#ff9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
  moodTrendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Food Entries Chart
  foodEntriesChartType: ChartType = 'bar';
  foodEntriesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Food Entries',
      data: [],
      backgroundColor: '#4caf50',
      borderColor: '#2e7d32',
      borderWidth: 1
    }]
  };
  foodEntriesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Weekly Overview Chart
  weeklyOverviewChartType: ChartType = 'bar';
  weeklyOverviewChartData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Food Entries',
        data: [],
        backgroundColor: '#4caf50',
        borderColor: '#2e7d32',
        borderWidth: 1
      },
      {
        label: 'Mood Entries',
        data: [],
        backgroundColor: '#ff9800',
        borderColor: '#f57c00',
        borderWidth: 1
      }
    ]
  };
  weeklyOverviewChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private moodService: MoodService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  getPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 'daily': return "Today's";
      case 'weekly': return "This Week's";
      case 'monthly': return "This Month's";
      default: return "Today's";
    }
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load summary based on period
    this.foodService.getFoodSummary(this.selectedPeriod).subscribe({
      next: (response) => {
        if (response.success) {
          this.summaryStats.foodEntries = response.data.summary.entryCount;
          this.summaryStats.calories = Math.round(response.data.summary.totalCalories || 0);
        }
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading food summary:', error);
        this.checkLoadingComplete();
      }
    });

    this.moodService.getMoodSummary(this.selectedPeriod).subscribe({
      next: (response) => {
        if (response.success) {
          this.summaryStats.moodEntries = response.data.summary.entryCount;
          this.summaryStats.avgMood = response.data.summary.averageRating || 0;
        }
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading mood summary:', error);
        this.checkLoadingComplete();
      }
    });

    // Load recent entries for activity
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
        this.loadMoodEntries();
      },
      error: (error) => {
        console.error('Error loading recent food entries:', error);
        this.loadMoodEntries();
      }
    });

    // Load mood trend data
    this.loadMoodTrendData();
    this.loadFoodEntriesData();
    this.loadWeeklyOverview();
    this.loadInsights();
  }

  loadMoodEntries() {
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
        this.recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        this.recentActivity = this.recentActivity.slice(0, 5);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading recent mood entries:', error);
        this.checkLoadingComplete();
      }
    });
  }

  loadMoodTrendData() {
    // Get mood entries for last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.moodService.getMoodEntries(1, 50).subscribe({
      next: (response) => {
        if (response.success) {
          const entries = response.data.entries.filter((entry: any) => {
            const entryDate = new Date(entry.startedAt);
            return entryDate >= startDate && entryDate <= endDate;
          });

          // Group by day and calculate average
          const dailyData: { [key: string]: number[] } = {};
          entries.forEach((entry: any) => {
            const date = new Date(entry.startedAt).toLocaleDateString('en-US', { weekday: 'short' });
            if (!dailyData[date]) dailyData[date] = [];
            dailyData[date].push(entry.moodRating);
          });

          const labels: string[] = [];
          const data: number[] = [];
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const label = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(label);
            data.push(dailyData[label] ? dailyData[label].reduce((a, b) => a + b, 0) / dailyData[label].length : 0);
          }

          this.moodTrendChartData = {
            labels,
            datasets: [{
              label: 'Mood Rating',
              data,
              borderColor: '#ff9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              tension: 0.4,
              fill: true
            }]
          };
        }
      },
      error: (error) => {
        console.error('Error loading mood trend data:', error);
      }
    });
  }

  loadFoodEntriesData() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.foodService.getFoodEntries(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          const entries = response.data.entries.filter((entry: any) => {
            const entryDate = new Date(entry.consumedAt);
            return entryDate >= startDate && entryDate <= endDate;
          });

          const dailyData: { [key: string]: number } = {};
          entries.forEach((entry: any) => {
            const date = new Date(entry.consumedAt).toLocaleDateString('en-US', { weekday: 'short' });
            dailyData[date] = (dailyData[date] || 0) + 1;
          });

          const labels: string[] = [];
          const data: number[] = [];
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const label = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(label);
            data.push(dailyData[label] || 0);
          }

          this.foodEntriesChartData = {
            labels,
            datasets: [{
              label: 'Food Entries',
              data,
              backgroundColor: '#4caf50',
              borderColor: '#2e7d32',
              borderWidth: 1
            }]
          };
        }
      },
      error: (error) => {
        console.error('Error loading food entries data:', error);
      }
    });
  }

  loadWeeklyOverview() {
    forkJoin({
      food: this.foodService.getFoodEntries(1, 200),
      mood: this.moodService.getMoodEntries(1, 200)
    }).subscribe({
      next: (responses) => {
        const foodEntries = responses.food?.success ? responses.food.data.entries : [];
        const moodEntries = responses.mood?.success ? responses.mood.data.entries : [];

        const foodData = [0, 0, 0, 0, 0, 0, 0];
        const moodData = [0, 0, 0, 0, 0, 0, 0];

        foodEntries.forEach((entry: any) => {
          const entryDate = new Date(entry.consumedAt);
          const dayIndex = (entryDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
          if (dayIndex >= 0 && dayIndex < 7) {
            foodData[dayIndex]++;
          }
        });

        moodEntries.forEach((entry: any) => {
          const entryDate = new Date(entry.startedAt);
          const dayIndex = (entryDate.getDay() + 6) % 7;
          if (dayIndex >= 0 && dayIndex < 7) {
            moodData[dayIndex]++;
          }
        });

        this.weeklyOverviewChartData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Food Entries',
              data: foodData,
              backgroundColor: '#4caf50',
              borderColor: '#2e7d32',
              borderWidth: 1
            },
            {
              label: 'Mood Entries',
              data: moodData,
              backgroundColor: '#ff9800',
              borderColor: '#f57c00',
              borderWidth: 1
            }
          ]
        };
      },
      error: (error) => {
        console.error('Error loading weekly overview:', error);
      }
    });
  }

  loadInsights() {
    this.analyticsService.getInsights(30).subscribe({
      next: (response) => {
        if (response.success && response.data.insights) {
          this.insights = response.data.insights.slice(0, 3).map((insight: string, index: number) => ({
            title: `Insight ${index + 1}`,
            description: insight,
            icon: 'lightbulb',
            type: 'neutral'
          }));
        } else {
          this.insights = [];
        }
      },
      error: (error) => {
        console.error('Error loading insights:', error);
        this.insights = [];
      }
    });
  }

  checkLoadingComplete() {
    // Simple check - in a real app you'd want more sophisticated loading state management
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
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
