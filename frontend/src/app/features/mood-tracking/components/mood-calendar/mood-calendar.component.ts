import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MoodService, MoodEntry } from '../../../../core/services/mood.service';

// MoodEntry interface is now imported from MoodService

interface CalendarDay {
  date: Date;
  moodEntries: MoodEntry[];
  averageMood: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-mood-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="mood-calendar-container">
      <mat-card>
        <mat-card-header>
          <div class="calendar-header">
            <h2>Mood Calendar</h2>
            <div class="calendar-controls">
              <button mat-icon-button (click)="previousMonth()">
                <mat-icon>chevron_left</mat-icon>
              </button>
              <span class="month-year">{{ currentMonthYear }}</span>
              <button mat-icon-button (click)="nextMonth()">
                <mat-icon>chevron_right</mat-icon>
              </button>
              <button mat-button (click)="goToToday()" class="today-button">
                Today
              </button>
            </div>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading mood data...</p>
          </div>
          
          <div *ngIf="!isLoading" class="calendar-content">
            <!-- Calendar Legend -->
            <div class="calendar-legend">
              <div class="legend-item">
                <div class="mood-color very-low"></div>
                <span>1-2 (Very Low)</span>
              </div>
              <div class="legend-item">
                <div class="mood-color low"></div>
                <span>3-4 (Low)</span>
              </div>
              <div class="legend-item">
                <div class="mood-color medium"></div>
                <span>5-6 (Medium)</span>
              </div>
              <div class="legend-item">
                <div class="mood-color high"></div>
                <span>7-8 (High)</span>
              </div>
              <div class="legend-item">
                <div class="mood-color very-high"></div>
                <span>9-10 (Very High)</span>
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="calendar-grid">
              <!-- Day Headers -->
              <div class="day-header" *ngFor="let day of dayHeaders">
                {{ day }}
              </div>
              
              <!-- Calendar Days -->
              <div class="calendar-day" 
                   *ngFor="let day of calendarDays" 
                   [class]="getDayClasses(day)"
                   (click)="onDayClick(day)"
                   [matTooltip]="getDayTooltip(day)">
                <div class="day-number">{{ day.date.getDate() }}</div>
                <div class="mood-indicators" *ngIf="day.moodEntries.length > 0">
                  <div class="mood-dot" 
                       *ngFor="let entry of day.moodEntries.slice(0, 3)"
                       [class]="'mood-' + getMoodLevel(entry.moodRating)"
                       [matTooltip]="getEntryTooltip(entry)">
                  </div>
                  <div class="more-indicator" *ngIf="day.moodEntries.length > 3">
                    +{{ day.moodEntries.length - 3 }}
                  </div>
                </div>
                <div class="average-mood" *ngIf="day.averageMood > 0">
                  {{ day.averageMood | number:'1.1-1' }}
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Selected Day Details -->
      <mat-card *ngIf="selectedDay" class="selected-day-card">
        <mat-card-header>
          <mat-card-title>
            {{ selectedDay.date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </mat-card-title>
          <button mat-icon-button (click)="closeSelectedDay()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="selectedDay.moodEntries.length === 0" class="no-entries">
            <mat-icon>mood</mat-icon>
            <p>No mood entries for this day</p>
            <button mat-raised-button color="primary" (click)="addMoodEntry()">
              <mat-icon>add</mat-icon>
              Add Mood Entry
            </button>
          </div>
          
          <div *ngIf="selectedDay.moodEntries.length > 0" class="mood-entries">
            <div class="mood-entry" *ngFor="let entry of selectedDay.moodEntries">
              <div class="entry-info">
                <div class="mood-rating">
                  <span class="rating-number">{{ entry.moodRating }}</span>
                  <span class="rating-scale">/10</span>
                </div>
                <div class="mood-details">
                  <h4>{{ getMoodTypeDisplay(entry.moodType) }}</h4>
                  <p class="entry-time">{{ formatTime(entry.startedAt) }}</p>
                  <p *ngIf="entry.notes" class="entry-notes">{{ entry.notes }}</p>
                </div>
              </div>
              <div class="entry-actions">
                <button mat-icon-button (click)="editMoodEntry(entry.id)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMoodEntry(entry.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            
            <div class="day-actions">
              <button mat-raised-button color="primary" (click)="addMoodEntry()">
                <mat-icon>add</mat-icon>
                Add Another Entry
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .mood-calendar-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .calendar-header h2 {
      margin: 0;
    }
    
    .calendar-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .month-year {
      font-size: 18px;
      font-weight: 500;
      min-width: 150px;
      text-align: center;
    }
    
    .today-button {
      margin-left: 8px;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px;
    }
    
    .loading-container p {
      margin: 0;
      color: #666;
    }
    
    .calendar-legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    
    .mood-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    
    .mood-color.very-low { background: #d32f2f; }
    .mood-color.low { background: #ff5722; }
    .mood-color.medium { background: #ff9800; }
    .mood-color.high { background: #4caf50; }
    .mood-color.very-high { background: #2e7d32; }
    
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: #e0e0e0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .day-header {
      background: #f5f5f5;
      padding: 12px 8px;
      text-align: center;
      font-weight: 500;
      font-size: 14px;
      color: #666;
    }
    
    .calendar-day {
      background: white;
      min-height: 80px;
      padding: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
    }
    
    .calendar-day:hover {
      background: #f5f5f5;
    }
    
    .calendar-day.other-month {
      background: #fafafa;
      color: #ccc;
    }
    
    .calendar-day.today {
      background: #e3f2fd;
      border: 2px solid #2196f3;
    }
    
    .calendar-day.has-entries {
      background: #f8f9fa;
    }
    
    .day-number {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .mood-indicators {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      margin-bottom: 4px;
    }
    
    .mood-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .mood-dot.mood-very-low { background: #d32f2f; }
    .mood-dot.mood-low { background: #ff5722; }
    .mood-dot.mood-medium { background: #ff9800; }
    .mood-dot.mood-high { background: #4caf50; }
    .mood-dot.mood-very-high { background: #2e7d32; }
    
    .more-indicator {
      font-size: 10px;
      color: #666;
      margin-left: 4px;
    }
    
    .average-mood {
      font-size: 12px;
      font-weight: 500;
      color: #333;
      text-align: center;
    }
    
    .selected-day-card {
      margin-top: 24px;
    }
    
    .no-entries {
      text-align: center;
      padding: 40px 20px;
    }
    
    .no-entries mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .no-entries p {
      color: #666;
      margin-bottom: 24px;
    }
    
    .mood-entries {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .mood-entry {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .entry-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .mood-rating {
      display: flex;
      align-items: baseline;
      gap: 2px;
      font-size: 20px;
      font-weight: bold;
      color: #3f51b5;
    }
    
    .rating-number {
      font-size: 24px;
    }
    
    .rating-scale {
      font-size: 14px;
      color: #666;
    }
    
    .mood-details h4 {
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .mood-details p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .entry-time {
      font-weight: 500;
    }
    
    .entry-notes {
      font-style: italic;
    }
    
    .entry-actions {
      display: flex;
      gap: 8px;
    }
    
    .day-actions {
      margin-top: 16px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .calendar-legend {
        gap: 12px;
      }
      
      .legend-item {
        font-size: 12px;
      }
      
      .calendar-day {
        min-height: 60px;
        padding: 4px;
      }
      
      .day-number {
        font-size: 12px;
      }
      
      .mood-dot {
        width: 6px;
        height: 6px;
      }
      
      .average-mood {
        font-size: 10px;
      }
    }
  `]
})
export class MoodCalendarComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() moodEntrySelected = new EventEmitter<number>();

  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;
  isLoading = true;
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private moodService: MoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMoodData();
  }

  get currentMonthYear(): string {
    return this.currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  private loadMoodData() {
    this.isLoading = true;
    const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    
    this.moodService.getMoodEntries().subscribe({
      next: (response) => {
        if (response.success) {
          this.buildCalendar(response.data.entries);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading mood data:', error);
        this.isLoading = false;
      }
    });
  }

  private buildCalendar(moodEntries: MoodEntry[]) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get first day of month and calculate starting date
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Build 42 days (6 weeks)
    this.calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEntries = moodEntries.filter(entry => {
        const entryDate = new Date(entry.startedAt);
        return entryDate.toDateString() === date.toDateString();
      });
      
      const averageMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.moodRating, 0) / dayEntries.length 
        : 0;
      
      this.calendarDays.push({
        date: new Date(date),
        moodEntries: dayEntries,
        averageMood: averageMood,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.loadMoodData();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.loadMoodData();
  }

  goToToday() {
    this.currentDate = new Date();
    this.loadMoodData();
  }

  onDayClick(day: CalendarDay) {
    this.selectedDay = day;
    this.dateSelected.emit(day.date);
  }

  closeSelectedDay() {
    this.selectedDay = null;
  }

  addMoodEntry() {
    if (this.selectedDay) {
      const date = this.selectedDay.date.toISOString().split('T')[0];
      this.router.navigate(['/mood-tracking/add'], { 
        queryParams: { date: date } 
      });
    } else {
      this.router.navigate(['/mood-tracking/add']);
    }
  }

  editMoodEntry(entryId: number) {
    this.moodEntrySelected.emit(entryId);
  }

  deleteMoodEntry(entryId: number) {
    if (confirm('Are you sure you want to delete this mood entry?')) {
      this.moodService.deleteMoodEntry(entryId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadMoodData(); // Reload calendar
            if (this.selectedDay) {
              this.selectedDay.moodEntries = this.selectedDay.moodEntries.filter(e => e.id !== entryId);
            }
          }
        },
        error: (error) => {
          console.error('Error deleting mood entry:', error);
        }
      });
    }
  }

  getDayClasses(day: CalendarDay): string {
    const classes = [];
    if (!day.isCurrentMonth) classes.push('other-month');
    if (day.isToday) classes.push('today');
    if (day.moodEntries.length > 0) classes.push('has-entries');
    return classes.join(' ');
  }

  getMoodLevel(rating: number): string {
    if (rating <= 2) return 'very-low';
    if (rating <= 4) return 'low';
    if (rating <= 6) return 'medium';
    if (rating <= 8) return 'high';
    return 'very-high';
  }

  getDayTooltip(day: CalendarDay): string {
    if (day.moodEntries.length === 0) {
      return `No mood entries for ${day.date.toLocaleDateString()}`;
    }
    
    const avgMood = day.averageMood.toFixed(1);
    const entryCount = day.moodEntries.length;
    return `${day.date.toLocaleDateString()}: ${entryCount} mood entr${entryCount === 1 ? 'y' : 'ies'}, average ${avgMood}/10`;
  }

  getEntryTooltip(entry: MoodEntry): string {
    return `${entry.moodType} (${entry.moodRating}/10) - ${new Date(entry.startedAt).toLocaleTimeString()}`;
  }

  getMoodTypeDisplay(moodType: string): string {
    const moodTypes: { [key: string]: string } = {
      'happy': '😊 Happy',
      'sad': '😢 Sad',
      'anxious': '😰 Anxious',
      'energetic': '⚡ Energetic',
      'tired': '😴 Tired',
      'stressed': '😤 Stressed',
      'calm': '😌 Calm',
      'irritable': '😤 Irritable',
      'focused': '😌 Focused',
      'confused': '😵 Confused'
    };
    return moodTypes[moodType] || moodType;
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

