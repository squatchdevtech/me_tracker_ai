import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MoodListComponent } from './mood-list.component';
import { MoodService } from '../../../../core/services/mood.service';

describe('MoodListComponent', () => {
  let component: MoodListComponent;
  let fixture: ComponentFixture<MoodListComponent>;
  let moodService: jasmine.SpyObj<MoodService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const moodServiceSpy = jasmine.createSpyObj('MoodService', ['getMoodEntries', 'deleteMoodEntry']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MoodListComponent],
      providers: [
        { provide: MoodService, useValue: moodServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoodListComponent);
    component = fixture.componentInstance;
    moodService = TestBed.inject(MoodService) as jasmine.SpyObj<MoodService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mood entries on init', () => {
    const mockResponse = {
      success: true,
      data: {
        entries: [
          {
            id: 1,
            moodRating: 8,
            moodType: 'happy',
            intensity: 0.8,
            startedAt: '2024-01-15T10:00:00Z',
            notes: 'Feeling great!'
          }
        ],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 }
      }
    };

    moodService.getMoodEntries.and.returnValue(of(mockResponse));
    component.ngOnInit();

    expect(moodService.getMoodEntries).toHaveBeenCalled();
    expect(component.moodEntries.length).toBe(1);
    expect(component.moodEntries[0].moodRating).toBe(8);
    expect(component.isLoading).toBe(false);
  });

  it('should handle empty mood entries', () => {
    const mockResponse = {
      success: true,
      data: {
        entries: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      }
    };

    moodService.getMoodEntries.and.returnValue(of(mockResponse));
    component.ngOnInit();

    expect(component.moodEntries.length).toBe(0);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when loading mood entries', () => {
    moodService.getMoodEntries.and.returnValue(throwError(() => new Error('Server error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading mood entries:', jasmine.any(Error));
    expect(component.isLoading).toBe(false);
  });

  it('should delete mood entry when confirmed', () => {
    const mockResponse = {
      success: true,
      message: 'Mood entry deleted successfully'
    };

    moodService.deleteMoodEntry.and.returnValue(of(mockResponse));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadMoodEntries');

    component.deleteEntry(1);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this mood entry?');
    expect(moodService.deleteMoodEntry).toHaveBeenCalledWith(1);
    expect(component.loadMoodEntries).toHaveBeenCalled();
  });

  it('should not delete mood entry when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteEntry(1);

    expect(moodService.deleteMoodEntry).not.toHaveBeenCalled();
  });

  it('should handle error when deleting mood entry', () => {
    moodService.deleteMoodEntry.and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');

    component.deleteEntry(1);

    expect(console.error).toHaveBeenCalledWith('Error deleting mood entry:', jasmine.any(Error));
  });

  it('should format date correctly', () => {
    const dateString = '2024-01-15T10:30:00Z';
    const formatted = component.formatDate(dateString);
    
    expect(formatted).toContain('1/15/2024');
    expect(formatted).toContain('10:30');
  });

  it('should format duration correctly for minutes', () => {
    expect(component.formatDuration(30)).toBe('30m');
    expect(component.formatDuration(45)).toBe('45m');
  });

  it('should format duration correctly for hours', () => {
    expect(component.formatDuration(60)).toBe('1h');
    expect(component.formatDuration(90)).toBe('1h 30m');
    expect(component.formatDuration(120)).toBe('2h');
  });

  it('should get mood type display with emoji', () => {
    expect(component.getMoodTypeDisplay('happy')).toBe('😊 Happy');
    expect(component.getMoodTypeDisplay('sad')).toBe('😢 Sad');
    expect(component.getMoodTypeDisplay('anxious')).toBe('😰 Anxious');
    expect(component.getMoodTypeDisplay('energetic')).toBe('⚡ Energetic');
    expect(component.getMoodTypeDisplay('tired')).toBe('😴 Tired');
    expect(component.getMoodTypeDisplay('stressed')).toBe('😤 Stressed');
    expect(component.getMoodTypeDisplay('calm')).toBe('😌 Calm');
    expect(component.getMoodTypeDisplay('irritable')).toBe('😤 Irritable');
    expect(component.getMoodTypeDisplay('focused')).toBe('😌 Focused');
    expect(component.getMoodTypeDisplay('confused')).toBe('😵 Confused');
  });

  it('should return original value for unknown mood type', () => {
    expect(component.getMoodTypeDisplay('unknown')).toBe('unknown');
  });

  it('should show loading state initially', () => {
    expect(component.isLoading).toBe(true);
  });

  it('should display mood entries when loaded', () => {
    const mockResponse = {
      success: true,
      data: {
        entries: [
          {
            id: 1,
            moodRating: 8,
            moodType: 'happy',
            intensity: 0.8,
            startedAt: '2024-01-15T10:00:00Z',
            notes: 'Feeling great!'
          }
        ],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 }
      }
    };

    moodService.getMoodEntries.and.returnValue(of(mockResponse));
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.mood-entry')).toBeTruthy();
    expect(compiled.querySelector('.rating-number').textContent).toContain('8');
  });

  it('should show empty state when no entries', () => {
    const mockResponse = {
      success: true,
      data: {
        entries: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      }
    };

    moodService.getMoodEntries.and.returnValue(of(mockResponse));
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
    expect(compiled.querySelector('.empty-state h3').textContent).toContain('No mood entries yet');
  });
});
























