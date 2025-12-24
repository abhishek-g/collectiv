# Toast Component Usage Guide

## Overview

The toast component provides a modern, Bootstrap-based notification system for Angular applications. It uses Angular signals, standalone components, and ng-bootstrap for maximum compatibility and performance.

## Setup

### 1. Add Toast Container to Your App

Add the `ToastContainerComponent` to your root app component template:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ToastContainerComponent } from '@nx-angular-express/shared-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <shared-toast-container></shared-toast-container>
  `,
})
export class AppComponent {}
```

### 2. Inject Toast Service

```typescript
import { Component, inject } from '@angular/core';
import { ToastService } from '@nx-angular-express/shared-components';

@Component({
  // ...
})
export class MyComponent {
  private readonly toastService = inject(ToastService);

  showSuccess() {
    this.toastService.success('Success!', 'Operation completed successfully');
  }
}
```

## Usage Examples

### Basic Toast

```typescript
// Simple success toast
this.toastService.success('Success', 'Your changes have been saved');

// Error toast
this.toastService.error('Error', 'Failed to save changes');

// Warning toast
this.toastService.warning('Warning', 'Please review your input');

// Info toast
this.toastService.info('Info', 'New features are available');
```

### Advanced Configuration

```typescript
// Custom toast with all options
const toastId = this.toastService.show({
  title: 'Custom Toast',
  body: 'This is a custom toast message',
  type: 'info', // 'success' | 'error' | 'warning' | 'info'
  dismissible: true,
  autohide: true,
  delay: 5000, // milliseconds
});

// Manually remove a toast
this.toastService.remove(toastId);
```

### Non-dismissible Toast

```typescript
this.toastService.show({
  title: 'Important',
  body: 'This toast cannot be dismissed',
  type: 'warning',
  dismissible: false,
  autohide: false,
});
```

### Handling Toast Dismissal

If you need to handle when a toast is dismissed, you can listen to the `dismiss` output event from the `ToastComponent`. However, when using `ToastContainerComponent`, dismissals are automatically handled by the service.

If you're using `ToastComponent` directly:

```typescript
// In your template
<shared-toast
  [title]="'Action Required'"
  [body]="'Click to perform action'"
  type="info"
  (dismiss)="onToastDismissed()"
/>
```

```typescript
// In your component
onToastDismissed() {
  // Perform action when toast is dismissed
  this.performAction();
}
```

### Clear All Toasts

```typescript
this.toastService.clear();
```

## Component API

### ToastComponent

**Inputs:**
- `title: string` (required) - Toast title
- `body: string` (required) - Toast body text
- `type: ToastType` - Toast type: 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `dismissible: boolean` - Whether toast can be dismissed (default: true)
- `autohide: boolean` - Whether toast auto-hides (default: true)
- `delay: number` - Auto-hide delay in milliseconds (default: 5000)

**Outputs:**
- `dismiss: EventEmitter<void>` - Emitted when toast is dismissed

### ToastService

**Methods:**
- `show(config: ToastConfig): string` - Show a toast, returns toast ID
- `success(title: string, body: string, config?: Partial<ToastConfig>): string`
- `error(title: string, body: string, config?: Partial<ToastConfig>): string`
- `warning(title: string, body: string, config?: Partial<ToastConfig>): string`
- `info(title: string, body: string, config?: Partial<ToastConfig>): string`
- `remove(id: string): void` - Remove a specific toast
- `clear(): void` - Clear all toasts

**Signals:**
- `toasts: Signal<Toast[]>` - Read-only signal of all active toasts
- `toastCount: Signal<number>` - Read-only signal of toast count

## Styling

The component uses Bootstrap 5 classes and Bootstrap Icons. Make sure you have:

1. Bootstrap CSS imported in your styles:
   ```scss
   @import 'bootstrap/dist/css/bootstrap.min.css';
   ```

2. Bootstrap Icons CDN in your `index.html`:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
   ```

## Internationalization (i18n)

The toast components support Angular i18n for all static text elements. The following elements are marked for translation:

- **Close button**: The dismiss button's `aria-label` attribute uses i18n with ID `@@toast.closeButton`

### Extracting i18n Messages

To extract i18n messages from the library, run:

```bash
ng extract-i18n --output-path src/locale
```

This will create translation files (e.g., `messages.xlf`) containing the translatable strings.

### Using Translated Messages

When you provide `title` and `body` to the toast service, you can use Angular's i18n pipe or `$localize`:

```typescript
import { $localize } from '@angular/localize/init';

// Using $localize
this.toastService.success(
  $localize`:@@toast.successTitle:Success`,
  $localize`:@@toast.successBody:Operation completed successfully`
);

// Or using i18n pipe in templates
this.toastService.success(
  'Success' | i18n,
  'Operation completed' | i18n
);
```

## Features

- ✅ Modern Angular features (signals, standalone components)
- ✅ Bootstrap 5 styling
- ✅ Bootstrap Icons
- ✅ Type-safe API
- ✅ Auto-hide support
- ✅ Manual dismissal
- ✅ EventEmitter-based dismissal handling
- ✅ Multiple toast support
- ✅ Internationalization (i18n) support
- ✅ Fully tested

