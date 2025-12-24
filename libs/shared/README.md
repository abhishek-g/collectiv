# Shared Library

A shared TypeScript library containing common types and helper functions used by both the frontend and backend applications.

## Structure

- **Types** (`src/lib/types/`): Common TypeScript interfaces and types
  - `common.types.ts`: API response types, pagination types, user types, etc.

- **Helpers** (`src/lib/helpers/`): Utility functions
  - `validation.helpers.ts`: Email validation, UUID validation, etc.
  - `formatting.helpers.ts`: Date formatting, currency formatting, etc.

## Usage

Import types and helpers in your frontend or backend code:

```typescript
// Import types
import { ApiResponse, User, PaginationParams } from '@nx-angular-express/shared';

// Import helpers
import { isValidEmail, formatDate, formatCurrency } from '@nx-angular-express/shared';

// Example usage
const response: ApiResponse<User> = {
  success: true,
  data: userData,
};

if (isValidEmail(email)) {
  // Process email
}
```

## Building

Run `nx build shared` to build the library.

## Running unit tests

Run `nx test shared` to execute the unit tests via [Vitest](https://vitest.dev/).
