import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// Mock $localize for i18n support in tests
if (typeof globalThis.$localize === 'undefined') {
  globalThis.$localize = (messageParts: TemplateStringsArray, ...expressions: readonly any[]) => {
    return messageParts.reduce((result, part, i) => {
      return result + part + (expressions[i] ?? '');
    }, '');
  };
}

setupTestBed();
