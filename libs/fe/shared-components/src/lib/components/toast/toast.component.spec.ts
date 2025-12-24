import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent, ToastType } from './toast.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { vi } from 'vitest';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent, NgbToastModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    component.title = 'Test Title';
    component.body = 'Test Body';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display title and body', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toast-header strong')?.textContent).toContain('Test Title');
    expect(compiled.querySelector('.toast-body')?.textContent).toContain('Test Body');
  });

  it('should apply correct type class for success', () => {
    component.type = 'success';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toast = compiled.querySelector('.toast');
    expect(toast?.classList.contains('text-bg-success')).toBe(true);
  });

  it('should apply correct type class for error', () => {
    component.type = 'error';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toast = compiled.querySelector('.toast');
    expect(toast?.classList.contains('text-bg-danger')).toBe(true);
  });

  it('should apply correct type class for warning', () => {
    component.type = 'warning';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toast = compiled.querySelector('.toast');
    expect(toast?.classList.contains('text-bg-warning')).toBe(true);
  });

  it('should apply correct type class for info', () => {
    component.type = 'info';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toast = compiled.querySelector('.toast');
    expect(toast?.classList.contains('text-bg-info')).toBe(true);
  });

  it('should show close button when dismissible is true', () => {
    component.dismissible = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-close')).toBeTruthy();
  });

  it('should hide close button when dismissible is false', () => {
    component.dismissible = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-close')).toBeFalsy();
  });

  it('should emit dismiss event when close button is clicked', () => {
    component.dismissible = true;
    fixture.detectChanges();
    
    const emitSpy = vi.spyOn(component.dismiss, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.btn-close') as HTMLButtonElement;
    closeButton.click();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should have correct icon class for success type', () => {
    component.type = 'success';
    fixture.detectChanges();
    expect(component.iconClass()).toBe('bi-check-circle-fill');
  });

  it('should have correct icon class for error type', () => {
    component.type = 'error';
    fixture.detectChanges();
    expect(component.iconClass()).toBe('bi-x-circle-fill');
  });

  it('should have correct icon class for warning type', () => {
    component.type = 'warning';
    fixture.detectChanges();
    expect(component.iconClass()).toBe('bi-exclamation-triangle-fill');
  });

  it('should have correct icon class for info type', () => {
    component.type = 'info';
    fixture.detectChanges();
    expect(component.iconClass()).toBe('bi-info-circle-fill');
  });
});

