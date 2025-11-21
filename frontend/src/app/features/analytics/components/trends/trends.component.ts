import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { AnalyticsService } from '../../../../core/services/analytics.service';

interface TrendData {
  mood: {
    averageRating: number;
    trend: string;
    moodTypeDistribution: { [key: string]: number };
  };
  food: {
    totalEntries: number;
    averageEntriesPerDay: number;
    topFoods: Array<{ name: string; count: number }>;
  };
}

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  template: `
    <div class="trends-container">
      <div class="header">
        <h1>Trends Analysis</h1>
        <div class="controls">
          <mat-form-field appearance="outline">
            <mat-label>Time Period</mat-label>
            <mat-select [(value)]="selectedPeriod" (selectionChange)="loadTrends()">
              <mat-option value="weekly">Weekly</mat-option>
              <mat-option value="monthly">Monthly</mat-option>
              <mat-option value="quarterly">Quarterly</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Months</mat-label>
            <mat-select [(value)]="selectedMonths" (selectionChange)="loadTrends()">
              <mat-option value="3">3 months</mat-option>
              <mat-option value="6">6 months</mat-option>
              <mat-option value="12">12 months</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button (click)="loadTrends()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <div class="content">
        <!-- Mood Trends -->
        <mat-card class="trend-card">
          <mat-card-header>
            <mat-card-title>Mood Trends</mat-card-title>
            <mat-card-subtitle>Your emotional patterns over time</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <div class="mood-summary">
                <div class="mood-stat">
                  <div class="stat-value">{{ trendData.mood.averageRating | number:'1.1-1' }}</div>
                  <div class="stat-label">Average Mood Rating</div>
                  <div class="trend-indicator" [class]="getTrendClass(trendData.mood.trend)">
                    <mat-icon>{{ getTrendIcon(trendData.mood.trend) }}</mat-icon>
                    {{ trendData.mood.trend | titlecase }}
                  </div>
                </div>
              </div>

              <div class="mood-types" *ngIf="Object.keys(trendData.mood.moodTypeDistribution).length > 0">
                <h4>Mood Type Distribution</h4>
                <div class="mood-chips">
                  <mat-chip *ngFor="let mood of getMoodTypeDistribution()" 
                    [class]="'mood-chip ' + mood.type">
                    {{ mood.emoji }} {{ mood.label }} ({{ mood.count }})
                  </mat-chip>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Food Trends -->
        <mat-card class="trend-card">
          <mat-card-header>
            <mat-card-title>Food Trends</mat-card-title>
            <mat-card-subtitle>Your eating patterns and preferences</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <div class="food-summary">
                <div class="food-stats">
                  <div class="food-stat">
                    <div class="stat-value">{{ trendData.food.totalEntries }}</div>
                    <div class="stat-label">Total Food Entries</div>
                  </div>
                  <div class="food-stat">
                    <div class="stat-value">{{ trendData.food.averageEntriesPerDay | number:'1.1-1' }}</div>
                    <div class="stat-label">Avg Entries/Day</div>
                  </div>
                </div>

                <div class="top-foods" *ngIf="trendData.food.topFoods.length > 0">
                  <h4>Most Consumed Foods</h4>
                  <div class="food-list">
                    <div class="food-item" *ngFor="let food of trendData.food.topFoods; let i = index">
                      <div class="food-rank">{{ i + 1 }}</div>
                      <div class="food-info">
                        <div class="food-name">{{ food.name }}</div>
                        <div class="food-count">{{ food.count }} times</div>
                      </div>
                      <div class="food-bar">
                        <div class="bar-fill" 
                             [style.width.%]="(food.count / trendData.food.topFoods[0].count) * 100">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Insights -->
        <mat-card class="insights-card">
          <mat-card-header>
            <mat-card-title>Trend Insights</mat-card-title>
            <mat-card-subtitle>Key observations from your data</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <div class="insights-list">
                <div class="insight-item" *ngFor="let insight of getInsights()">
                  <mat-icon class="insight-icon">{{ insight.icon }}</mat-icon>
                  <div class="insight-content">
                    <h4>{{ insight.title }}</h4>
                    <p>{{ insight.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .trends-container {
      padding: 20px;
      max-width: 1000px;
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
    
    .controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .trend-card {
      margin-bottom: 24px;
    }
    
    .mood-summary {
      margin-bottom: 24px;
    }
    
    .mood-stat {
      text-align: center;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }
    
    .stat-value {
      font-size: 48px;
      font-weight: bold;
      color: #3f51b5;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 16px;
      color: #666;
      margin-bottom: 12px;
    }
    
    .trend-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 20px;
      width: fit-content;
      margin: 0 auto;
    }
    
    .trend-indicator.improving {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .trend-indicator.declining {
      background: #ffebee;
      color: #c62828;
    }
    
    .trend-indicator.stable {
      background: #f5f5f5;
      color: #666;
    }
    
    .mood-types h4 {
      margin: 24px 0 16px 0;
      color: #333;
    }
    
    .mood-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .mood-chip {
      font-size: 14px;
    }
    
    .mood-chip.happy { background: #e8f5e8; color: #2e7d32; }
    .mood-chip.sad { background: #e3f2fd; color: #1976d2; }
    .mood-chip.anxious { background: #fff3e0; color: #f57c00; }
    .mood-chip.energetic { background: #f3e5f5; color: #7b1fa2; }
    .mood-chip.tired { background: #f5f5f5; color: #616161; }
    .mood-chip.stressed { background: #ffebee; color: #c62828; }
    .mood-chip.calm { background: #e0f2f1; color: #00695c; }
    .mood-chip.irritable { background: #fce4ec; color: #ad1457; }
    .mood-chip.focused { background: #e8eaf6; color: #3f51b5; }
    .mood-chip.confused { background: #fff8e1; color: #f9a825; }
    
    .food-summary {
      margin-bottom: 24px;
    }
    
    .food-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .food-stat {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .food-stat .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #4caf50;
      margin-bottom: 4px;
    }
    
    .food-stat .stat-label {
      font-size: 14px;
      color: #666;
    }
    
    .top-foods h4 {
      margin: 0 0 16px 0;
      color: #333;
    }
    
    .food-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .food-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #fafafa;
      border-radius: 8px;
    }
    
    .food-rank {
      font-size: 18px;
      font-weight: bold;
      color: #3f51b5;
      min-width: 24px;
    }
    
    .food-info {
      flex: 1;
    }
    
    .food-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .food-count {
      font-size: 14px;
      color: #666;
    }
    
    .food-bar {
      width: 100px;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .bar-fill {
      height: 100%;
      background: #4caf50;
      transition: width 0.3s ease;
    }
    
    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .insight-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .insight-icon {
      color: #3f51b5;
      margin-top: 4px;
    }
    
    .insight-content h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 16px;
    }
    
    .insight-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
  `]
})
export class TrendsComponent implements OnInit {
  trendData: TrendData = {
    mood: {
      averageRating: 0,
      trend: 'stable',
      moodTypeDistribution: {}
    },
    food: {
      totalEntries: 0,
      averageEntriesPerDay: 0,
      topFoods: []
    }
  };
  selectedPeriod = 'monthly';
  selectedMonths = 6;
  isLoading = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadTrends();
  }

  loadTrends() {
    this.isLoading = true;
    this.analyticsService.getTrends(this.selectedPeriod, this.selectedMonths).subscribe({
      next: (response) => {
        if (response.success) {
          this.trendData = response.data.trends;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trends:', error);
        this.isLoading = false;
      }
    });
  }

  getTrendClass(trend: string): string {
    return trend.toLowerCase();
  }

  getTrendIcon(trend: string): string {
    switch (trend.toLowerCase()) {
      case 'improving': return 'trending_up';
      case 'declining': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getMoodTypeDistribution() {
    return Object.entries(this.trendData.mood.moodTypeDistribution)
      .map(([type, count]) => ({
        type,
        count,
        label: this.getMoodTypeLabel(type),
        emoji: this.getMoodTypeEmoji(type)
      }))
      .sort((a, b) => b.count - a.count);
  }

  getMoodTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'happy': 'Happy',
      'sad': 'Sad',
      'anxious': 'Anxious',
      'energetic': 'Energetic',
      'tired': 'Tired',
      'stressed': 'Stressed',
      'calm': 'Calm',
      'irritable': 'Irritable',
      'focused': 'Focused',
      'confused': 'Confused'
    };
    return labels[type] || type;
  }

  getMoodTypeEmoji(type: string): string {
    const emojis: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'anxious': '😰',
      'energetic': '⚡',
      'tired': '😴',
      'stressed': '😤',
      'calm': '😌',
      'irritable': '😤',
      'focused': '😌',
      'confused': '😵'
    };
    return emojis[type] || '😐';
  }

  getInsights() {
    const insights = [];
    
    // Mood insights
    if (this.trendData.mood.averageRating >= 7) {
      insights.push({
        icon: 'mood',
        title: 'Positive Mood Trend',
        description: 'Your average mood rating is quite positive! Keep up whatever is working for you.'
      });
    } else if (this.trendData.mood.averageRating <= 4) {
      insights.push({
        icon: 'psychology',
        title: 'Mood Support Needed',
        description: 'Consider tracking what activities or foods help improve your mood when you\'re feeling down.'
      });
    }

    // Food insights
    if (this.trendData.food.averageEntriesPerDay < 2) {
      insights.push({
        icon: 'restaurant',
        title: 'Increase Food Tracking',
        description: 'Try logging more meals to get better insights into your eating patterns.'
      });
    }

    if (this.trendData.food.topFoods.length > 0 && this.trendData.food.topFoods[0].count > 10) {
      insights.push({
        icon: 'repeat',
        title: 'Food Variety',
        description: `You eat ${this.trendData.food.topFoods[0].name} frequently. Consider adding more variety to your diet.`
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: 'info',
        title: 'Keep Tracking',
        description: 'Continue tracking your food and mood to discover more insights about your patterns.'
      });
    }

    return insights;
  }
}

