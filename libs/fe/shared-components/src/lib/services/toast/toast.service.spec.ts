import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a toast when show is called', () => {
    const id = service.show({
      title: 'Test',
      body: 'Test body',
    });

    expect(service.toastCount()).toBe(1);
    expect(id).toBeTruthy();
  });

  it('should remove a toast when remove is called', () => {
    const id = service.show({
      title: 'Test',
      body: 'Test body',
    });

    expect(service.toastCount()).toBe(1);
    service.remove(id);
    expect(service.toastCount()).toBe(0);
  });


  it('should clear all toasts when clear is called', () => {
    service.show({ title: 'Test 1', body: 'Body 1' });
    service.show({ title: 'Test 2', body: 'Body 2' });
    expect(service.toastCount()).toBe(2);

    service.clear();
    expect(service.toastCount()).toBe(0);
  });

  it('should create success toast with correct type', () => {
    const id = service.success('Success', 'Operation completed');
    const toast = service.toasts().find((t) => t.id === id);
    expect(toast?.type).toBe('success');
  });

  it('should create error toast with correct type', () => {
    const id = service.error('Error', 'Something went wrong');
    const toast = service.toasts().find((t) => t.id === id);
    expect(toast?.type).toBe('error');
  });

  it('should create warning toast with correct type', () => {
    const id = service.warning('Warning', 'Please be careful');
    const toast = service.toasts().find((t) => t.id === id);
    expect(toast?.type).toBe('warning');
  });

  it('should create info toast with correct type', () => {
    const id = service.info('Info', 'Here is some information');
    const toast = service.toasts().find((t) => t.id === id);
    expect(toast?.type).toBe('info');
  });

  it('should set default values for optional properties', () => {
    const id = service.show({
      title: 'Test',
      body: 'Test body',
    });

    const toast = service.toasts().find((t) => t.id === id);
    expect(toast?.type).toBe('info');
    expect(toast?.dismissible).toBe(true);
    expect(toast?.autohide).toBe(true);
    expect(toast?.delay).toBe(5000);
  });
});

