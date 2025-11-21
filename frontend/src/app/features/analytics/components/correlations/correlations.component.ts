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

interface Correlation {
  foodName: string;
  correlation: number;
  dataPoints: number;
}

@Component({
  selector: 'app-correlations',
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
    <div class="correlations-container">
      <div class="header">
        <h1>Food-Mood Correlations</h1>
        <div class="controls">
          <mat-form-field appearance="outline">
            <mat-label>Time Period</mat-label>
            <mat-select [(value)]="selectedDays" (selectionChange)="loadCorrelations()">
              <mat-option value="7">Last 7 days</mat-option>
              <mat-option value="30">Last 30 days</mat-option>
              <mat-option value="90">Last 90 days</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button (click)="loadCorrelations()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <div class="content">
        <!-- Summary Card -->
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Analysis Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <div class="summary-stats">
                <div class="stat-item">
                  <mat-icon>restaurant</mat-icon>
                  <div>
                    <h3>{{ summary.totalFoodEntries }}</h3>
                    <p>Food Entries</p>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon>mood</mat-icon>
                  <div>
                    <h3>{{ summary.totalMoodEntries }}</h3>
                    <p>Mood Entries</p>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon>trending_up</mat-icon>
                  <div>
                    <h3>{{ correlations.length }}</h3>
                    <p>Correlations Found</p>
                  </div>
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

        <!-- Correlations List -->
        <mat-card class="correlations-card">
          <mat-card-header>
            <mat-card-title>Food-Mood Correlations</mat-card-title>
            <mat-card-subtitle>
              Positive correlations suggest the food may improve mood, negative correlations suggest it may worsen mood
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="!isLoading; else loadingTemplate">
              <div *ngIf="correlations.length === 0" class="no-data">
                <mat-icon>info</mat-icon>
                <h3>No correlations found</h3>
                <p>You need more data to identify patterns. Try tracking your food and mood for a few more days.</p>
              </div>
              
              <div *ngIf="correlations.length > 0" class="correlations-list">
                <div class="correlation-item" *ngFor="let correlation of correlations; let i = index">
                  <div class="correlation-header">
                    <div class="food-name">
                      <mat-icon class="food-icon">restaurant</mat-icon>
                      <span>{{ correlation.foodName }}</span>
                    </div>
                    <div class="correlation-value" [class]="getCorrelationClass(correlation.correlation)">
                      {{ correlation.correlation | number:'1.2-2' }}
                    </div>
                  </div>
                  
                  <div class="correlation-details">
                    <div class="correlation-bar">
                      <div class="bar-fill" 
                           [style.width.%]="Math.abs(correlation.correlation) * 100"
                           [class]="getCorrelationClass(correlation.correlation)">
                      </div>
                    </div>
                    
                    <div class="correlation-meta">
                      <span class="data-points">{{ correlation.dataPoints }} data points</span>
                      <span class="strength" [class]="getCorrelationClass(correlation.correlation)">
                        {{ getCorrelationStrength(correlation.correlation) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Legend -->
        <mat-card class="legend-card">
          <mat-card-header>
            <mat-card-title>Understanding Correlations</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-color positive"></div>
                <span><strong>Positive (0.3 to 1.0):</strong> Food may improve mood</span>
              </div>
              <div class="legend-item">
                <div class="legend-color neutral"></div>
                <span><strong>Neutral (-0.3 to 0.3):</strong> No clear relationship</span>
              </div>
              <div class="legend-item">
                <div class="legend-color negative"></div>
                <span><strong>Negative (-1.0 to -0.3):</strong> Food may worsen mood</span>
              </div>
            </div>
            <p class="legend-note">
              <mat-icon>info</mat-icon>
              Correlations are based on statistical analysis of your data. More data points provide more reliable results.
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .correlations-container {
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
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3f51b5;
    }
    
    .stat-item h3 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    
    .stat-item p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    
    .no-data {
      text-align: center;
      padding: 40px 20px;
    }
    
    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .no-data h3 {
      margin: 16px 0 8px 0;
      color: #666;
    }
    
    .no-data p {
      color: #999;
      margin: 0;
    }
    
    .correlations-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .correlation-item {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 12px;
      background: #fafafa;
      transition: box-shadow 0.2s;
    }
    
    .correlation-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .correlation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .food-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
    }
    
    .food-icon {
      color: #4caf50;
    }
    
    .correlation-value {
      font-size: 24px;
      font-weight: bold;
      padding: 8px 16px;
      border-radius: 20px;
    }
    
    .correlation-value.positive {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .correlation-value.negative {
      background: #ffebee;
      color: #c62828;
    }
    
    .correlation-value.neutral {
      background: #f5f5f5;
      color: #666;
    }
    
    .correlation-details {
      margin-top: 12px;
    }
    
    .correlation-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    .bar-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    
    .bar-fill.positive {
      background: #4caf50;
    }
    
    .bar-fill.negative {
      background: #f44336;
    }
    
    .bar-fill.neutral {
      background: #9e9e9e;
    }
    
    .correlation-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #666;
    }
    
    .strength {
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .strength.positive {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .strength.negative {
      background: #ffebee;
      color: #c62828;
    }
    
    .strength.neutral {
      background: #f5f5f5;
      color: #666;
    }
    
    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }
    
    .legend-color.positive {
      background: #4caf50;
    }
    
    .legend-color.negative {
      background: #f44336;
    }
    
    .legend-color.neutral {
      background: #9e9e9e;
    }
    
    .legend-note {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 0;
      font-size: 14px;
      color: #666;
      font-style: italic;
    }
    
    .legend-note mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-top: 2px;
    }
  `]
})
export class CorrelationsComponent implements OnInit {
  correlations: Correlation[] = [];
  summary = {
    totalFoodEntries: 0,
    totalMoodEntries: 0
  };
  selectedDays = 30;
  isLoading = true;

  Math = Math; // Make Math available in template

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadCorrelations();
  }

  loadCorrelations() {
    this.isLoading = true;
    this.analyticsService.getCorrelations(this.selectedDays).subscribe({
      next: (response) => {
        if (response.success) {
          this.correlations = response.data.correlations;
          this.summary = {
            totalFoodEntries: response.data.totalFoodEntries,
            totalMoodEntries: response.data.totalMoodEntries
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading correlations:', error);
        this.isLoading = false;
      }
    });
  }

  getCorrelationClass(correlation: number): string {
    if (correlation > 0.3) return 'positive';
    if (correlation < -0.3) return 'negative';
    return 'neutral';
  }

  getCorrelationStrength(correlation: number): string {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Weak';
    return 'Very Weak';
  }
}

