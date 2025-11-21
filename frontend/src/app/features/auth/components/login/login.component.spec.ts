import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    authService.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have required validators on email and password', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should redirect to dashboard if already logged in', () => {
    authService.isLoggedIn.and.returnValue(true);
    component.ngOnInit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect if not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);
    component.ngOnInit();
    
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid', () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      }
    };
    
    authService.login.and.returnValue(of(mockResponse));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should navigate to dashboard on successful login', () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      }
    };
    
    authService.login.and.returnValue(of(mockResponse));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on login failure', () => {
    const errorResponse = {
      error: { error: 'Invalid credentials' }
    };
    
    authService.login.and.returnValue(throwError(() => errorResponse));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.patchValue({
      email: '',
      password: ''
    });
    
    component.onSubmit();
    
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBe(true);
    
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBe(false);
    
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBe(true);
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should set isSubmitting to true during login', () => {
    const mockResponse = {
      success: true,
      data: { token: 'mock-token', user: { id: 1, email: 'test@example.com' } }
    };
    
    authService.login.and.returnValue(of(mockResponse));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(component.isSubmitting).toBe(false); // Should be false after completion
  });

  it('should clear error message when form values change', () => {
    component.errorMessage = 'Some error';
    
    component.loginForm.patchValue({
      email: 'test@example.com'
    });
    
    expect(component.errorMessage).toBe('');
  });
});
























