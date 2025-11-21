import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FoodSearchComponent } from './food-search.component';
import { FoodService } from '../../../../core/services/food.service';

describe('FoodSearchComponent', () => {
  let component: FoodSearchComponent;
  let fixture: ComponentFixture<FoodSearchComponent>;
  let foodService: jasmine.SpyObj<FoodService>;

  beforeEach(async () => {
    const foodServiceSpy = jasmine.createSpyObj('FoodService', ['searchFoods']);

    await TestBed.configureTestingModule({
      imports: [FoodSearchComponent],
      providers: [
        { provide: FoodService, useValue: foodServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodSearchComponent);
    component = fixture.componentInstance;
    foodService = TestBed.inject(FoodService) as jasmine.SpyObj<FoodService>;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search results', () => {
    expect(component.searchResults).toEqual([]);
    expect(component.selectedFood).toBeNull();
    expect(component.showResults).toBe(false);
    expect(component.isSearching).toBe(false);
  });

  it('should search for foods when query length is at least 2', (done) => {
    const mockFoods = [
      {
        id: 1,
        name: 'Apple',
        category: 'Fruits',
        caloriesPerServing: 95,
        proteinPerServing: 0.5
      }
    ];

    // Mock the search method to return our test data
    spyOn(component, 'searchFoods').and.returnValue(of(mockFoods));

    component.searchControl.setValue('apple');
    
    // Wait for debounce
    setTimeout(() => {
      expect(component.searchFoods).toHaveBeenCalledWith('apple');
      expect(component.searchResults).toEqual(mockFoods);
      expect(component.showResults).toBe(true);
      expect(component.isSearching).toBe(false);
      done();
    }, 350);
  });

  it('should not search when query length is less than 2', (done) => {
    spyOn(component, 'searchFoods');

    component.searchControl.setValue('a');
    
    setTimeout(() => {
      expect(component.searchFoods).not.toHaveBeenCalled();
      expect(component.showResults).toBe(false);
      done();
    }, 350);
  });

  it('should filter mock foods correctly', () => {
    const mockFoods = component.getMockFoods();
    const filtered = mockFoods.filter(food => 
      food.name.toLowerCase().includes('apple')
    );

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(food => food.name.toLowerCase().includes('apple'))).toBe(true);
  });

  it('should select food and emit event', () => {
    const mockFood = {
      id: 1,
      name: 'Apple',
      category: 'Fruits',
      caloriesPerServing: 95
    };

    spyOn(component.foodSelected, 'emit');

    component.selectFood(mockFood);

    expect(component.selectedFood).toEqual(mockFood);
    expect(component.foodSelected.emit).toHaveBeenCalledWith(mockFood);
    expect(component.showResults).toBe(false);
  });

  it('should clear selection', () => {
    component.selectedFood = {
      id: 1,
      name: 'Apple',
      category: 'Fruits'
    };
    component.searchControl.setValue('apple');

    component.clearSelection();

    expect(component.selectedFood).toBeNull();
    expect(component.searchControl.value).toBe('');
  });

  it('should emit custom food request event', () => {
    spyOn(component.customFoodRequested, 'emit');

    component.addCustomFood();

    expect(component.customFoodRequested.emit).toHaveBeenCalled();
  });

  it('should show results on focus if there are search results', () => {
    component.searchResults = [
      { id: 1, name: 'Apple', category: 'Fruits' }
    ];

    component.onSearchFocus();

    expect(component.showResults).toBe(true);
  });

  it('should not show results on focus if no search results', () => {
    component.searchResults = [];

    component.onSearchFocus();

    expect(component.showResults).toBe(false);
  });

  it('should hide results on blur after delay', (done) => {
    component.showResults = true;

    component.onSearchBlur();

    setTimeout(() => {
      expect(component.showResults).toBe(false);
      done();
    }, 250);
  });

  it('should have correct mock foods data structure', () => {
    const mockFoods = component.getMockFoods();

    expect(mockFoods.length).toBeGreaterThan(0);
    mockFoods.forEach(food => {
      expect(food.id).toBeDefined();
      expect(food.name).toBeDefined();
      expect(food.category).toBeDefined();
      expect(food.caloriesPerServing).toBeDefined();
    });
  });

  it('should display search results in template', () => {
    component.searchResults = [
      {
        id: 1,
        name: 'Apple',
        brand: 'Generic',
        category: 'Fruits',
        caloriesPerServing: 95,
        proteinPerServing: 0.5
      }
    ];
    component.showResults = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.search-results')).toBeTruthy();
    expect(compiled.querySelector('.food-item')).toBeTruthy();
    expect(compiled.querySelector('.food-info h4').textContent).toContain('Apple');
  });

  it('should display selected food in template', () => {
    component.selectedFood = {
      id: 1,
      name: 'Apple',
      brand: 'Generic',
      caloriesPerServing: 95,
      proteinPerServing: 0.5
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.selected-food')).toBeTruthy();
    expect(compiled.querySelector('.selected-food-details h4').textContent).toContain('Apple');
  });

  it('should display no results message when no foods found', () => {
    component.searchResults = [];
    component.showResults = true;
    component.isSearching = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.no-results')).toBeTruthy();
    expect(compiled.querySelector('.no-results h3').textContent).toContain('No foods found');
  });

  it('should display loading state when searching', () => {
    component.isSearching = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-results')).toBeTruthy();
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });
});
























