import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, SignupRequest } from '../../services/auth.service';
import { $localize } from '@angular/localize/init';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab: 'login' | 'signup' = 'login';

  // Login form
  loginForm: LoginRequest = {
    email: '',
    password: '',
  };

  // Signup form
  signupForm: SignupRequest = {
    name: '',
    email: '',
    password: '',
    phone: '',
  };

  // Error messages
  loginError = '';
  signupError = '';
  signupSuccess = '';

  // Loading states
  loginLoading = false;
  signupLoading = false;

  switchTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.clearErrors();
  }

  onLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.loginError = $localize`:@@auth.fillAllFields:Please fill in all fields`;
      return;
    }

    this.loginLoading = true;
    this.loginError = '';

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.setToken(response.data.token);
          // Redirect to home or dashboard
          this.router.navigate(['/']);
        } else {
          this.loginError = response.error || $localize`:@@auth.loginFailed:Login failed`;
        }
        this.loginLoading = false;
      },
      error: (error) => {
        this.loginError = error.error?.error || $localize`:@@auth.loginFailedRetry:Login failed. Please try again.`;
        this.loginLoading = false;
      },
    });
  }

  onSignup(): void {
    if (!this.signupForm.name || !this.signupForm.email || !this.signupForm.password) {
      this.signupError = $localize`:@@auth.fillRequiredFields:Please fill in all required fields`;
      return;
    }

    if (this.signupForm.password.length < 6) {
      this.signupError = $localize`:@@auth.passwordMinLength:Password must be at least 6 characters`;
      return;
    }

    this.signupLoading = true;
    this.signupError = '';
    this.signupSuccess = '';

    // Prepare signup data - only include phone if it has a value
    const signupData: SignupRequest = {
      name: this.signupForm.name,
      email: this.signupForm.email,
      password: this.signupForm.password,
    };

    if (this.signupForm.phone && this.signupForm.phone.trim()) {
      signupData.phone = this.signupForm.phone.trim();
    }

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log('Signup response:', response);
        if (response.success) {
          this.signupSuccess = $localize`:@@auth.accountCreated:Account created successfully! Please login.`;
          // Switch to login tab after 2 seconds
          setTimeout(() => {
            this.activeTab = 'login';
            this.signupForm = {
              name: '',
              email: '',
              password: '',
              phone: '',
            };
          }, 2000);
        } else {
          this.signupError = response.error || $localize`:@@auth.signupFailed:Signup failed`;
        }
        this.signupLoading = false;
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.signupError = error.error?.error || error.message || $localize`:@@auth.signupFailedRetry:Signup failed. Please try again.`;
        this.signupLoading = false;
      },
    });
  }

  private clearErrors(): void {
    this.loginError = '';
    this.signupError = '';
    this.signupSuccess = '';
  }
}

