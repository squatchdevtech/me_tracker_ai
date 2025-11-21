import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { FoodService } from '../../../../core/services/food.service';

interface FoodItem {
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

@Component({
  selector: 'app-food-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <div class="food-search-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search for food</mat-label>
        <input matInput 
               [formControl]="searchControl" 
               placeholder="e.g., Apple, Chicken Breast, Rice..."
               (focus)="onSearchFocus()"
               (blur)="onSearchBlur()">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <!-- Search Results -->
      <div *ngIf="showResults && searchResults.length > 0" class="search-results">
        <mat-card class="results-card">
          <mat-card-header>
            <mat-card-title>Search Results</mat-card-title>
            <mat-card-subtitle>{{ searchResults.length }} foods found</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="food-list">
              <div class="food-item" 
                   *ngFor="let food of searchResults" 
                   (click)="selectFood(food)"
                   [class.selected]="selectedFood?.id === food.id">
                <div class="food-info">
                  <h4>{{ food.name }}</h4>
                  <p *ngIf="food.brand" class="food-brand">{{ food.brand }}</p>
                  <p *ngIf="food.category" class="food-category">{{ food.category }}</p>
                  
                  <div class="nutrition-preview" *ngIf="food.caloriesPerServing">
                    <span class="nutrition-item">
                      <mat-icon>local_fire_department</mat-icon>
                      {{ food.caloriesPerServing }} cal
                    </span>
                    <span class="nutrition-item" *ngIf="food.proteinPerServing">
                      <mat-icon>fitness_center</mat-icon>
                      {{ food.proteinPerServing }}g protein
                    </span>
                    <span class="nutrition-item" *ngIf="food.carbsPerServing">
                      <mat-icon>grain</mat-icon>
                      {{ food.carbsPerServing }}g carbs
                    </span>
                  </div>
                </div>
                
                <div class="food-actions">
                  <button mat-icon-button (click)="selectFood(food)" 
                    [color]="selectedFood?.id === food.id ? 'primary' : ''">
                    <mat-icon>{{ selectedFood?.id === food.id ? 'check_circle' : 'add_circle' }}</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- No Results -->
      <div *ngIf="showResults && searchResults.length === 0 && !isSearching" class="no-results">
        <mat-card>
          <mat-card-content>
            <div class="no-results-content">
              <mat-icon>search_off</mat-icon>
              <h3>No foods found</h3>
              <p>Try searching with different keywords or add a custom food item.</p>
              <button mat-raised-button color="primary" (click)="addCustomFood()">
                <mat-icon>add</mat-icon>
                Add Custom Food
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading -->
      <div *ngIf="isSearching" class="loading-results">
        <mat-card>
          <mat-card-content>
            <div class="loading-content">
              <mat-spinner diameter="32"></mat-spinner>
              <p>Searching foods...</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Selected Food -->
      <div *ngIf="selectedFood" class="selected-food">
        <mat-card class="selected-card">
          <mat-card-content>
            <div class="selected-food-info">
              <div class="selected-food-details">
                <h4>{{ selectedFood.name }}</h4>
                <p *ngIf="selectedFood.brand" class="food-brand">{{ selectedFood.brand }}</p>
                <div class="nutrition-details" *ngIf="selectedFood.caloriesPerServing">
                  <div class="nutrition-grid">
                    <div class="nutrition-item">
                      <mat-icon>local_fire_department</mat-icon>
                      <span>{{ selectedFood.caloriesPerServing }} cal</span>
                    </div>
                    <div class="nutrition-item" *ngIf="selectedFood.proteinPerServing">
                      <mat-icon>fitness_center</mat-icon>
                      <span>{{ selectedFood.proteinPerServing }}g protein</span>
                    </div>
                    <div class="nutrition-item" *ngIf="selectedFood.carbsPerServing">
                      <mat-icon>grain</mat-icon>
                      <span>{{ selectedFood.carbsPerServing }}g carbs</span>
                    </div>
                    <div class="nutrition-item" *ngIf="selectedFood.fatPerServing">
                      <mat-icon>opacity</mat-icon>
                      <span>{{ selectedFood.fatPerServing }}g fat</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="selected-food-actions">
                <button mat-icon-button (click)="clearSelection()" color="warn">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .food-search-container {
      width: 100%;
    }
    
    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .search-results {
      position: relative;
      z-index: 1000;
    }
    
    .results-card {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .food-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .food-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .food-item:hover {
      background: #f5f5f5;
      border-color: #3f51b5;
    }
    
    .food-item.selected {
      background: #e3f2fd;
      border-color: #3f51b5;
    }
    
    .food-info h4 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 16px;
    }
    
    .food-brand {
      margin: 0 0 4px 0;
      color: #666;
      font-size: 14px;
      font-style: italic;
    }
    
    .food-category {
      margin: 0 0 8px 0;
      color: #888;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    .nutrition-preview {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .nutrition-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }
    
    .nutrition-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .food-actions {
      margin-left: 12px;
    }
    
    .no-results-content {
      text-align: center;
      padding: 40px 20px;
    }
    
    .no-results-content mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .no-results-content h3 {
      margin: 16px 0 8px 0;
      color: #666;
    }
    
    .no-results-content p {
      color: #999;
      margin-bottom: 24px;
    }
    
    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px 20px;
    }
    
    .loading-content p {
      margin: 0;
      color: #666;
    }
    
    .selected-food {
      margin-top: 16px;
    }
    
    .selected-card {
      background: #e8f5e8;
      border: 1px solid #4caf50;
    }
    
    .selected-food-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .selected-food-details h4 {
      margin: 0 0 4px 0;
      color: #2e7d32;
      font-size: 18px;
    }
    
    .nutrition-details {
      margin-top: 12px;
    }
    
    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }
    
    .nutrition-grid .nutrition-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #2e7d32;
    }
    
    .nutrition-grid .nutrition-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .selected-food-actions {
      margin-left: 16px;
    }
  `]
})
export class FoodSearchComponent implements OnInit {
  @Input() placeholder = 'Search for food...';
  @Output() foodSelected = new EventEmitter<FoodItem>();
  @Output() customFoodRequested = new EventEmitter<void>();

  searchControl = new FormControl('');
  searchResults: FoodItem[] = [];
  selectedFood: FoodItem | null = null;
  showResults = false;
  isSearching = false;

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query && query.length >= 2) {
            this.isSearching = true;
            this.showResults = true;
            return this.searchFoods(query);
          } else {
            this.showResults = false;
            this.isSearching = false;
            return of([]);
          }
        })
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isSearching = false;
        }
      });
  }

  private searchFoods(query: string): Observable<FoodItem[]> {
    return this.foodService.searchFoodDatabase(query).pipe(
      switchMap((response: any) => {
        if (response.success) {
          return of(response.data.foods);
        } else {
          console.error('Search API error:', response.error);
          return of([]);
        }
      }),
      catchError((error) => {
        console.error('Search error:', error);
        // Fallback to mock data if API fails
        return of(this.getMockFoods().filter(food => 
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          (food.brand && food.brand.toLowerCase().includes(query.toLowerCase()))
        ));
      })
    );
  }

  private getMockFoods(): FoodItem[] {
    return [
      {
        id: 1,
        name: 'Apple',
        category: 'Fruits',
        servingSize: 1,
        servingUnit: 'medium',
        caloriesPerServing: 95,
        proteinPerServing: 0.5,
        carbsPerServing: 25,
        fatPerServing: 0.3,
        fiberPerServing: 4,
        sugarPerServing: 19,
        sodiumPerServing: 2
      },
      {
        id: 2,
        name: 'Chicken Breast',
        category: 'Meat',
        servingSize: 100,
        servingUnit: 'g',
        caloriesPerServing: 165,
        proteinPerServing: 31,
        carbsPerServing: 0,
        fatPerServing: 3.6,
        fiberPerServing: 0,
        sugarPerServing: 0,
        sodiumPerServing: 74
      },
      {
        id: 3,
        name: 'Brown Rice',
        category: 'Grains',
        servingSize: 1,
        servingUnit: 'cup',
        caloriesPerServing: 216,
        proteinPerServing: 5,
        carbsPerServing: 45,
        fatPerServing: 1.8,
        fiberPerServing: 3.5,
        sugarPerServing: 0.7,
        sodiumPerServing: 10
      },
      {
        id: 4,
        name: 'Banana',
        category: 'Fruits',
        servingSize: 1,
        servingUnit: 'medium',
        caloriesPerServing: 105,
        proteinPerServing: 1.3,
        carbsPerServing: 27,
        fatPerServing: 0.4,
        fiberPerServing: 3.1,
        sugarPerServing: 14,
        sodiumPerServing: 1
      },
      {
        id: 5,
        name: 'Greek Yogurt',
        brand: 'Chobani',
        category: 'Dairy',
        servingSize: 1,
        servingUnit: 'cup',
        caloriesPerServing: 100,
        proteinPerServing: 17,
        carbsPerServing: 6,
        fatPerServing: 0,
        fiberPerServing: 0,
        sugarPerServing: 6,
        sodiumPerServing: 50
      }
    ];
  }

  onSearchFocus() {
    if (this.searchResults.length > 0) {
      this.showResults = true;
    }
  }

  onSearchBlur() {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  selectFood(food: FoodItem) {
    this.selectedFood = food;
    this.foodSelected.emit(food);
    this.showResults = false;
  }

  clearSelection() {
    this.selectedFood = null;
    this.searchControl.setValue('');
  }

  addCustomFood() {
    this.customFoodRequested.emit();
  }
}

