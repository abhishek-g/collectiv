import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from '../../services/toast/toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent, NgbToastModule],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts from service', () => {
    toastService.show({
      title: 'Test',
      body: 'Test body',
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('shared-toast')).toBeTruthy();
  });

  it('should remove toast when dismiss is called', () => {
    const id = toastService.show({
      title: 'Test',
      body: 'Test body',
    });

    fixture.detectChanges();
    expect(toastService.toastCount()).toBe(1);

    component.onDismiss(id);
    fixture.detectChanges();
    expect(toastService.toastCount()).toBe(0);
  });
});

