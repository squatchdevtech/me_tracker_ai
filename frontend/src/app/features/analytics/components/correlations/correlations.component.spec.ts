import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CorrelationsComponent } from './correlations.component';
import { AnalyticsService } from '../../../../core/services/analytics.service';

describe('CorrelationsComponent', () => {
  let component: CorrelationsComponent;
  let fixture: ComponentFixture<CorrelationsComponent>;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    const analyticsServiceSpy = jasmine.createSpyObj('AnalyticsService', ['getCorrelations']);

    await TestBed.configureTestingModule({
      imports: [CorrelationsComponent],
      providers: [
        { provide: AnalyticsService, useValue: analyticsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CorrelationsComponent);
    component = fixture.componentInstance;
    analyticsService = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.correlations).toEqual([]);
    expect(component.summary.totalFoodEntries).toBe(0);
    expect(component.summary.totalMoodEntries).toBe(0);
    expect(component.selectedDays).toBe(30);
    expect(component.isLoading).toBe(true);
  });

  it('should load correlations on init', () => {
    const mockResponse = {
      success: true,
      data: {
        correlations: [
          {
            foodName: 'Apple',
            correlation: 0.65,
            dataPoints: 15
          },
          {
            foodName: 'Chocolate',
            correlation: -0.42,
            dataPoints: 8
          }
        ],
        totalFoodEntries: 25,
        totalMoodEntries: 20
      }
    };

    analyticsService.getCorrelations.and.returnValue(of(mockResponse));
    component.ngOnInit();

    expect(analyticsService.getCorrelations).toHaveBeenCalledWith(30);
    expect(component.correlations).toEqual(mockResponse.data.correlations);
    expect(component.summary.totalFoodEntries).toBe(25);
    expect(component.summary.totalMoodEntries).toBe(20);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when loading correlations', () => {
    analyticsService.getCorrelations.and.returnValue(throwError(() => new Error('Server error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading correlations:', jasmine.any(Error));
    expect(component.isLoading).toBe(false);
  });

  it('should reload correlations when selectedDays changes', () => {
    const mockResponse = {
      success: true,
      data: {
        correlations: [],
        totalFoodEntries: 0,
        totalMoodEntries: 0
      }
    };

    analyticsService.getCorrelations.and.returnValue(of(mockResponse));
    component.selectedDays = 7;
    component.loadCorrelations();

    expect(analyticsService.getCorrelations).toHaveBeenCalledWith(7);
  });

  it('should get correlation class correctly', () => {
    expect(component.getCorrelationClass(0.8)).toBe('positive');
    expect(component.getCorrelationClass(0.1)).toBe('neutral');
    expect(component.getCorrelationClass(-0.8)).toBe('negative');
    expect(component.getCorrelationClass(-0.1)).toBe('neutral');
  });

  it('should get correlation strength correctly', () => {
    expect(component.getCorrelationStrength(0.8)).toBe('Strong');
    expect(component.getCorrelationStrength(0.5)).toBe('Moderate');
    expect(component.getCorrelationStrength(0.3)).toBe('Weak');
    expect(component.getCorrelationStrength(0.1)).toBe('Very Weak');
  });

  it('should display correlations in template', () => {
    component.correlations = [
      {
        foodName: 'Apple',
        correlation: 0.65,
        dataPoints: 15
      }
    ];
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.correlations-list')).toBeTruthy();
    expect(compiled.querySelector('.correlation-item')).toBeTruthy();
    expect(compiled.querySelector('.food-name span').textContent).toContain('Apple');
  });

  it('should display no data message when no correlations', () => {
    component.correlations = [];
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.no-data')).toBeTruthy();
    expect(compiled.querySelector('.no-data h3').textContent).toContain('No correlations found');
  });

  it('should display loading state', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-container')).toBeTruthy();
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });

  it('should display summary statistics', () => {
    component.summary = {
      totalFoodEntries: 25,
      totalMoodEntries: 20
    };
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.stat-value').textContent).toContain('25');
  });

  it('should have Math available in template', () => {
    expect(component.Math).toBe(Math);
  });

  it('should handle refresh button click', () => {
    spyOn(component, 'loadCorrelations');
    
    const compiled = fixture.nativeElement;
    const refreshButton = compiled.querySelector('button[mat-icon-button]');
    refreshButton.click();

    expect(component.loadCorrelations).toHaveBeenCalled();
  });

  it('should display correlation values with correct formatting', () => {
    component.correlations = [
      {
        foodName: 'Apple',
        correlation: 0.654321,
        dataPoints: 15
      }
    ];
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const correlationValue = compiled.querySelector('.correlation-value');
    expect(correlationValue.textContent).toContain('0.65');
  });

  it('should display data points count', () => {
    component.correlations = [
      {
        foodName: 'Apple',
        correlation: 0.65,
        dataPoints: 15
      }
    ];
    component.isLoading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.data-points').textContent).toContain('15 data points');
  });
});
























