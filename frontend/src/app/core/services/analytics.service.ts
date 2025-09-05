import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Correlation {
  foodName: string;
  correlation: number;
  dataPoints: number;
}

export interface Trend {
  mood: {
    averageRating: number;
    trend: string;
    moodTypeDistribution: Record<string, number>;
  };
  food: {
    totalEntries: number;
    averageEntriesPerDay: number;
    topFoods: Array<{ name: string; count: number }>;
  };
}

export interface Insight {
  type: 'positive' | 'negative' | 'neutral';
  message: string;
  confidence?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCorrelations(days: number = 30): Observable<any> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get(`${this.API_URL}/analytics/correlations`, { params });
  }

  getTrends(period: 'monthly' = 'monthly', months: number = 6): Observable<any> {
    const params = new HttpParams()
      .set('period', period)
      .set('months', months.toString());
    return this.http.get(`${this.API_URL}/analytics/trends`, { params });
  }

  getInsights(days: number = 30): Observable<any> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get(`${this.API_URL}/analytics/insights`, { params });
  }

  exportData(format: 'json' | 'csv' = 'json', startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams().set('format', format);
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get(`${this.API_URL}/analytics/export`, { 
      params,
      responseType: format === 'csv' ? 'text' : 'json'
    });
  }

  downloadFile(data: any, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getCorrelationStrength(correlation: number): { strength: string; color: string } {
    const abs = Math.abs(correlation);
    
    if (abs >= 0.7) {
      return { strength: 'Strong', color: '#f44336' };
    } else if (abs >= 0.4) {
      return { strength: 'Moderate', color: '#ff9800' };
    } else if (abs >= 0.2) {
      return { strength: 'Weak', color: '#4caf50' };
    } else {
      return { strength: 'Very Weak', color: '#9e9e9e' };
    }
  }

  getCorrelationDirection(correlation: number): { direction: string; emoji: string } {
    if (correlation > 0.1) {
      return { direction: 'Positive', emoji: '📈' };
    } else if (correlation < -0.1) {
      return { direction: 'Negative', emoji: '📉' };
    } else {
      return { direction: 'Neutral', emoji: '➡️' };
    }
  }
}
