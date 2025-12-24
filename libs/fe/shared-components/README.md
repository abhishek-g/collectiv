# Shared Components Library

A frontend library containing reusable Angular components, services, directives, and pipes that can be shared across frontend applications.

## Structure

This library is organized into:
- **Components** (`src/lib/components/`) - Reusable UI components
- **Services** (`src/lib/services/`) - Shared Angular services
- **Directives** (`src/lib/directives/`) - Custom directives
- **Pipes** (`src/lib/pipes/`) - Custom pipes

## Usage

Import components and services in your Angular applications:

```typescript
import { ButtonComponent } from '@nx-angular-express/shared-components';
```

## Running unit tests

Run `nx test shared-components` to execute the unit tests.
