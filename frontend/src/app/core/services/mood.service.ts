import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MoodEntry {
  id?: number;
  moodRating: number;
  moodType: 'happy' | 'sad' | 'anxious' | 'energetic' | 'tired' | 'stressed' | 'calm' | 'irritable' | 'focused' | 'confused';
  intensity?: number;
  durationMinutes?: number;
  startedAt: string;
  endedAt?: string;
  notes?: string;
  triggers?: string;
  createdAt?: string;
}

export interface MoodSummary {
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: {
    averageRating: number;
    averageIntensity: number;
    entryCount: number;
    moodTypeDistribution: Record<string, number>;
  };
  entries: MoodEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMoodEntries(page: number = 1, limit: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get(`${this.API_URL}/mood-entries`, { params });
  }

  getMoodEntry(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/mood-entries/${id}`);
  }

  createMoodEntry(entry: MoodEntry): Observable<any> {
    return this.http.post(`${this.API_URL}/mood-entries`, entry);
  }

  updateMoodEntry(id: number, entry: MoodEntry): Observable<any> {
    return this.http.put(`${this.API_URL}/mood-entries/${id}`, entry);
  }

  deleteMoodEntry(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/mood-entries/${id}`);
  }

  getMoodSummary(period: 'daily' | 'weekly' | 'monthly' = 'daily', date?: string): Observable<any> {
    const params = new HttpParams()
      .set('period', period);
    
    if (date) {
      params.set('date', date);
    }
    
    return this.http.get(`${this.API_URL}/mood-entries/summary`, { params });
  }

  getMoodTypeEmoji(moodType: string): string {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      energetic: '⚡',
      tired: '😴',
      stressed: '😫',
      calm: '😌',
      irritable: '😠',
      focused: '🎯',
      confused: '😕'
    };
    return emojiMap[moodType] || '😐';
  }

  getMoodTypeColor(moodType: string): string {
    const colorMap: Record<string, string> = {
      happy: '#4caf50',
      sad: '#2196f3',
      anxious: '#ff9800',
      energetic: '#e91e63',
      tired: '#9e9e9e',
      stressed: '#f44336',
      calm: '#00bcd4',
      irritable: '#ff5722',
      focused: '#673ab7',
      confused: '#795548'
    };
    return colorMap[moodType] || '#757575';
  }
}
