import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and store token', () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      };

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.token).toBe('mock-jwt-token');
        expect(service.isLoggedIn()).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockResponse.data.user);
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register new user', () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          email: 'newuser@example.com',
          firstName: 'Jane',
          lastName: 'Smith'
        }
      };

      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      service.register(registerData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.email).toBe('newuser@example.com');
      });

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear token and user data', () => {
      // Set up logged in state
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));

      service.logout();

      expect(service.isLoggedIn()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should get user profile', () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01'
        }
      };

      // Set up logged in state
      localStorage.setItem('token', 'mock-token');

      service.getProfile().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.email).toBe('test@example.com');
      });

      const req = httpMock.expectOne('/api/auth/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      req.flush(mockResponse);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          email: 'updated@example.com',
          firstName: 'John',
          lastName: 'Updated'
        }
      };

      const updateData = {
        firstName: 'John',
        lastName: 'Updated',
        email: 'updated@example.com'
      };

      localStorage.setItem('token', 'mock-token');

      service.updateProfile(updateData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.lastName).toBe('Updated');
      });

      const req = httpMock.expectOne('/api/auth/profile');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'mock-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when no token', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data when logged in', () => {
      const userData = { id: 1, email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(userData));
      expect(service.getCurrentUser()).toEqual(userData);
    });

    it('should return null when not logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});

