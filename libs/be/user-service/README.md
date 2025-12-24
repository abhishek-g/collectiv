# User Service Library

A reusable library containing user management business logic, database models, and services.

## Structure

- **Models** (`src/lib/models/`): User data models and DTOs
  - `user.model.ts`: UserRow, CreateUserDto, UpdateUserDto, LoginDto, UserResponse

- **Services** (`src/lib/services/`): Business logic
  - `user.service.ts`: UserService class with all user operations

- **Database** (`src/lib/database/`): Database migrations and utilities
  - `migrate.ts`: Migration runner
  - `migrations/`: SQL migration files

- **Config** (`src/lib/config/`): Configuration
  - `database.ts`: MySQL connection pool and database utilities

## Usage

Import from the library in your applications:

```typescript
import { 
  userService, 
  CreateUserDto, 
  UserResponse,
  testConnection,
  createDatabaseIfNotExists,
  runMigrations 
} from '@nx-angular-express/user-service';

// Use the service
const user = await userService.createUser(userData);
const userById = await userService.getUserById(userId);
const users = await userService.listUsers(page, limit);
```

## Building

Run `nx build user-service` to build the library.

## Running unit tests

Run `nx test user-service` to execute the unit tests via [Vitest](https://vitest.dev/).
