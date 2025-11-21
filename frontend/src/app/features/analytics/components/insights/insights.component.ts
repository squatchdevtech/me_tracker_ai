import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnalyticsService } from '../../../../core/services/analytics.service';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'suggestion';
  confidence: number;
  category: 'mood' | 'food' | 'correlation' | 'pattern';
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="insights-container">
      <div class="header">
        <h1>AI Insights</h1>
        <div class="controls">
          <mat-form-field appearance="outline">
            <mat-label>Time Period</mat-label>
            <mat-select [(value)]="selectedDays" (selectionChange)="loadInsights()">
              <mat-option value="7">Last 7 days</mat-option>
              <mat-option value="30">Last 30 days</mat-option>
              <mat-option value="90">Last 90 days</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button (click)="loadInsights()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <div class="content">
        <!-- Summary Stats -->
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Insights Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <div class="summary-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ insights.length }}</div>
                  <div class="stat-label">Total Insights</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ getHighPriorityCount() }}</div>
                  <div class="stat-label">High Priority</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ getActionableCount() }}</div>
                  <div class="stat-label">Actionable</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ getCategoryCount('correlation') }}</div>
                  <div class="stat-label">Correlations</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Filter Controls -->
        <mat-card class="filter-card">
          <mat-card-content>
            <div class="filter-controls">
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select [(value)]="selectedCategory" (selectionChange)="filterInsights()">
                  <mat-option value="all">All Categories</mat-option>
                  <mat-option value="mood">Mood</mat-option>
                  <mat-option value="food">Food</mat-option>
                  <mat-option value="correlation">Correlations</mat-option>
                  <mat-option value="pattern">Patterns</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Priority</mat-label>
                <mat-select [(value)]="selectedPriority" (selectionChange)="filterInsights()">
                  <mat-option value="all">All Priorities</mat-option>
                  <mat-option value="high">High Priority</mat-option>
                  <mat-option value="medium">Medium Priority</mat-option>
                  <mat-option value="low">Low Priority</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Type</mat-label>
                <mat-select [(value)]="selectedType" (selectionChange)="filterInsights()">
                  <mat-option value="all">All Types</mat-option>
                  <mat-option value="positive">Positive</mat-option>
                  <mat-option value="negative">Negative</mat-option>
                  <mat-option value="suggestion">Suggestions</mat-option>
                  <mat-option value="neutral">Neutral</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Insights List -->
        <div class="insights-list">
          <div *ngIf="!isLoading; else loadingTemplate">
            <div *ngIf="filteredInsights.length === 0" class="no-insights">
              <mat-icon>lightbulb_outline</mat-icon>
              <h3>No insights available</h3>
              <p>Keep tracking your food and mood to generate personalized insights!</p>
            </div>
            
            <mat-card *ngFor="let insight of filteredInsights" 
              class="insight-card" 
              [class]="'insight-' + insight.type">
              <mat-card-content>
                <div class="insight-header">
                  <div class="insight-title">
                    <mat-icon class="insight-icon" [class]="'icon-' + insight.type">
                      {{ getInsightIcon(insight.type) }}
                    </mat-icon>
                    <h3>{{ insight.title }}</h3>
                  </div>
                  <div class="insight-meta">
                    <mat-chip [class]="'priority-' + insight.priority">
                      {{ insight.priority | titlecase }}
                    </mat-chip>
                    <mat-chip [class]="'category-' + insight.category">
                      {{ insight.category | titlecase }}
                    </mat-chip>
                    <mat-chip *ngIf="insight.actionable" class="actionable">
                      Actionable
                    </mat-chip>
                  </div>
                </div>
                
                <div class="insight-content">
                  <p>{{ insight.description }}</p>
                  
                  <div class="insight-footer">
                    <div class="confidence">
                      <span class="confidence-label">Confidence:</span>
                      <div class="confidence-bar">
                        <div class="confidence-fill" 
                             [style.width.%]="insight.confidence * 100">
                        </div>
                      </div>
                      <span class="confidence-value">{{ (insight.confidence * 100) | number:'1.0-0' }}%</span>
                    </div>
                    
                    <div class="insight-actions" *ngIf="insight.actionable">
                      <button mat-button color="primary" (click)="markAsRead(insight.id)">
                        <mat-icon>check</mat-icon>
                        Mark as Read
                      </button>
                      <button mat-button (click)="dismissInsight(insight.id)">
                        <mat-icon>close</mat-icon>
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .insights-container {
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
    
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }
    
    .stat-item {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #3f51b5;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    
    .filter-controls {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .filter-controls mat-form-field {
      min-width: 150px;
    }
    
    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .no-insights {
      text-align: center;
      padding: 60px 20px;
    }
    
    .no-insights mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .no-insights h3 {
      margin: 16px 0 8px 0;
      color: #666;
    }
    
    .no-insights p {
      color: #999;
      margin: 0;
    }
    
    .insight-card {
      transition: box-shadow 0.2s;
    }
    
    .insight-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .insight-card.insight-positive {
      border-left: 4px solid #4caf50;
    }
    
    .insight-card.insight-negative {
      border-left: 4px solid #f44336;
    }
    
    .insight-card.insight-suggestion {
      border-left: 4px solid #ff9800;
    }
    
    .insight-card.insight-neutral {
      border-left: 4px solid #9e9e9e;
    }
    
    .insight-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .insight-title {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    
    .insight-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .insight-icon.icon-positive {
      color: #4caf50;
    }
    
    .insight-icon.icon-negative {
      color: #f44336;
    }
    
    .insight-icon.icon-suggestion {
      color: #ff9800;
    }
    
    .insight-icon.icon-neutral {
      color: #9e9e9e;
    }
    
    .insight-title h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    
    .insight-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .insight-content p {
      margin: 0 0 16px 0;
      line-height: 1.6;
      color: #555;
    }
    
    .insight-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    
    .confidence {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .confidence-label {
      font-size: 14px;
      color: #666;
    }
    
    .confidence-bar {
      width: 100px;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .confidence-fill {
      height: 100%;
      background: #3f51b5;
      transition: width 0.3s ease;
    }
    
    .confidence-value {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    
    .insight-actions {
      display: flex;
      gap: 8px;
    }
    
    .priority-high {
      background: #ffebee;
      color: #c62828;
    }
    
    .priority-medium {
      background: #fff3e0;
      color: #f57c00;
    }
    
    .priority-low {
      background: #f5f5f5;
      color: #666;
    }
    
    .category-mood {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .category-food {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .category-correlation {
      background: #f3e5f5;
      color: #7b1fa2;
    }
    
    .category-pattern {
      background: #fff8e1;
      color: #f9a825;
    }
    
    .actionable {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
  `]
})
export class InsightsComponent implements OnInit {
  insights: Insight[] = [];
  filteredInsights: Insight[] = [];
  selectedDays = 30;
  selectedCategory = 'all';
  selectedPriority = 'all';
  selectedType = 'all';
  isLoading = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadInsights();
  }

  loadInsights() {
    this.isLoading = true;
    this.analyticsService.getInsights(this.selectedDays).subscribe({
      next: (response) => {
        if (response.success) {
          this.insights = response.data.insights || [];
          this.filterInsights();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading insights:', error);
        this.isLoading = false;
      }
    });
  }

  filterInsights() {
    this.filteredInsights = this.insights.filter(insight => {
      const categoryMatch = this.selectedCategory === 'all' || insight.category === this.selectedCategory;
      const priorityMatch = this.selectedPriority === 'all' || insight.priority === this.selectedPriority;
      const typeMatch = this.selectedType === 'all' || insight.type === this.selectedType;
      
      return categoryMatch && priorityMatch && typeMatch;
    });
  }

  getHighPriorityCount(): number {
    return this.insights.filter(insight => insight.priority === 'high').length;
  }

  getActionableCount(): number {
    return this.insights.filter(insight => insight.actionable).length;
  }

  getCategoryCount(category: string): number {
    return this.insights.filter(insight => insight.category === category).length;
  }

  getInsightIcon(type: string): string {
    switch (type) {
      case 'positive': return 'trending_up';
      case 'negative': return 'trending_down';
      case 'suggestion': return 'lightbulb';
      case 'neutral': return 'info';
      default: return 'help';
    }
  }

  markAsRead(insightId: string) {
    // TODO: Implement mark as read functionality
    console.log('Marking insight as read:', insightId);
  }

  dismissInsight(insightId: string) {
    // TODO: Implement dismiss functionality
    console.log('Dismissing insight:', insightId);
  }
}

