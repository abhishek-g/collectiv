import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { vi } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: Router,
          useValue: {
            url: '/',
            navigate: vi.fn(),
            events: {
              pipe: vi.fn(() => ({
                subscribe: vi.fn(),
              })),
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            firstChild: null,
            snapshot: {
              paramMap: {
                has: vi.fn(() => false),
                get: vi.fn(),
              },
              data: {},
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: vi.fn(() => false),
            removeToken: vi.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
