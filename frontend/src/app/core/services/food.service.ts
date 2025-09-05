import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FoodEntry {
  id?: number;
  foodName: string;
  quantity?: number;
  unit?: string;
  nutritionalData?: any;
  consumedAt: string;
  notes?: string;
  createdAt?: string;
}

export interface FoodSummary {
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    totalSugar: number;
    totalSodium: number;
    entryCount: number;
  };
  entries: FoodEntry[];
}

export interface FoodDatabase {
  id: number;
  name: string;
  brand?: string;
  category?: string;
  servingSize?: number;
  servingUnit?: string;
  caloriesPerServing?: number;
  proteinPerServing?: number;
  carbsPerServing?: number;
  fatPerServing?: number;
  fiberPerServing?: number;
  sugarPerServing?: number;
  sodiumPerServing?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getFoodEntries(page: number = 1, limit: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get(`${this.API_URL}/food-entries`, { params });
  }

  getFoodEntry(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/food-entries/${id}`);
  }

  createFoodEntry(entry: FoodEntry): Observable<any> {
    return this.http.post(`${this.API_URL}/food-entries`, entry);
  }

  updateFoodEntry(id: number, entry: FoodEntry): Observable<any> {
    return this.http.put(`${this.API_URL}/food-entries/${id}`, entry);
  }

  deleteFoodEntry(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/food-entries/${id}`);
  }

  getFoodSummary(period: 'daily' | 'weekly' | 'monthly' = 'daily', date?: string): Observable<any> {
    const params = new HttpParams()
      .set('period', period);
    
    if (date) {
      params.set('date', date);
    }
    
    return this.http.get(`${this.API_URL}/food-entries/summary`, { params });
  }

  searchFoodDatabase(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.API_URL}/foods/search`, { params });
  }

  getFoodFromDatabase(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/foods/${id}`);
  }
}
