import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalyticsService]
    });
    service = TestBed.inject(AnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCorrelations', () => {
    it('should get food-mood correlations', () => {
      const mockResponse = {
        success: true,
        data: {
          period: { days: 30, startDate: '2024-01-01T00:00:00Z' },
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

      service.getCorrelations(30).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.correlations.length).toBe(2);
        expect(response.data.correlations[0].foodName).toBe('Apple');
        expect(response.data.correlations[0].correlation).toBe(0.65);
      });

      const req = httpMock.expectOne('/api/analytics/correlations?days=30');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get correlations with default 30 days', () => {
      const mockResponse = {
        success: true,
        data: { correlations: [], totalFoodEntries: 0, totalMoodEntries: 0 }
      };

      service.getCorrelations().subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne('/api/analytics/correlations?days=30');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getTrends', () => {
    it('should get mood and food trends', () => {
      const mockResponse = {
        success: true,
        data: {
          period: { months: 6, startDate: '2024-01-01T00:00:00Z', endDate: '2024-06-30T23:59:59Z' },
          trends: {
            mood: {
              averageRating: 7.2,
              trend: 'improving',
              moodTypeDistribution: {
                happy: 15,
                energetic: 10,
                calm: 8
              }
            },
            food: {
              totalEntries: 50,
              averageEntriesPerDay: 2.5,
              topFoods: [
                { name: 'Apple', count: 12 },
                { name: 'Banana', count: 8 }
              ]
            }
          }
        }
      };

      service.getTrends('monthly', 6).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.trends.mood.averageRating).toBe(7.2);
        expect(response.data.trends.mood.trend).toBe('improving');
        expect(response.data.trends.food.totalEntries).toBe(50);
      });

      const req = httpMock.expectOne('/api/analytics/trends?period=monthly&months=6');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get trends with default parameters', () => {
      const mockResponse = {
        success: true,
        data: { trends: { mood: {}, food: {} } }
      };

      service.getTrends().subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne('/api/analytics/trends?period=monthly&months=6');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getInsights', () => {
    it('should get AI-generated insights', () => {
      const mockResponse = {
        success: true,
        data: {
          period: { days: 30, startDate: '2024-01-01T00:00:00Z' },
          insights: [
            {
              id: '1',
              title: 'Positive Mood Trend',
              description: 'Your mood has been consistently positive this week!',
              type: 'positive',
              confidence: 0.85,
              category: 'mood',
              actionable: true,
              priority: 'high'
            },
            {
              id: '2',
              title: 'Food Variety Suggestion',
              description: 'Consider adding more variety to your diet.',
              type: 'suggestion',
              confidence: 0.72,
              category: 'food',
              actionable: true,
              priority: 'medium'
            }
          ]
        }
      };

      service.getInsights(30).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.insights.length).toBe(2);
        expect(response.data.insights[0].title).toBe('Positive Mood Trend');
        expect(response.data.insights[0].confidence).toBe(0.85);
      });

      const req = httpMock.expectOne('/api/analytics/insights?days=30');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get insights with default 30 days', () => {
      const mockResponse = {
        success: true,
        data: { insights: [] }
      };

      service.getInsights().subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne('/api/analytics/insights?days=30');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('exportData', () => {
    it('should export data as JSON', () => {
      const mockResponse = {
        exportDate: '2024-01-15T10:00:00Z',
        dateRange: { startDate: null, endDate: null },
        foodEntries: [],
        moodEntries: []
      };

      service.exportData('json').subscribe(response => {
        expect(response.exportDate).toBe('2024-01-15T10:00:00Z');
      });

      const req = httpMock.expectOne('/api/analytics/export?format=json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should export data as CSV', () => {
      const mockCsvData = 'Date,Type,Name,Value,Notes\n2024-01-15,Food,Apple,1,\n';

      service.exportData('csv').subscribe(response => {
        expect(response).toBe(mockCsvData);
      });

      const req = httpMock.expectOne('/api/analytics/export?format=csv');
      expect(req.request.method).toBe('GET');
      req.flush(mockCsvData, { headers: { 'content-type': 'text/csv' } });
    });

    it('should export data with date range', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const mockResponse = {
        exportDate: '2024-01-15T10:00:00Z',
        dateRange: { startDate, endDate },
        foodEntries: [],
        moodEntries: []
      };

      service.exportData('json', startDate, endDate).subscribe(response => {
        expect(response.dateRange.startDate).toBe(startDate);
        expect(response.dateRange.endDate).toBe(endDate);
      });

      const req = httpMock.expectOne(`/api/analytics/export?format=json&startDate=${startDate}&endDate=${endDate}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
























