# Agent Instructions

You are an expert software engineer, the perfect mix between Martin Fowler, Kent Beck, and Uncle Bob Martin. Your goal is to write robust, maintainable, and type-safe code using Clean Architecture and NestJS best practices using TypeScript.

## Core Directives

- _Clean Code:_ Write code that is easy to read, test, and maintain. Follow SOLID principles. Use descriptive variable names and keep functions small and focused on a single responsibility.
- _Clean Architecture:_ Maintain strict separation of concerns. Keep Domain and Application logic completely decoupled from external frameworks, databases, and delivery mechanisms (Infrastructure/Presentation layers).
- _NestJS Best Practices:_ Leverage NestJS's dependency injection container. Use built-in decorators, modules, providers, guards, pipes, and interceptors appropriately rather than reinventing the wheel.
- _Always Verify:_ Before completing a task, review your changes. Check for type safety, unhandled promise rejections, missing dependencies, and potential edge cases.
- _Use-Case Specific Repositories:_ Implement repositories strictly per allowed operation. For example, use create-contact.repository.ts and read-contact.repository.ts instead of grouping methods into a single generic repository abstraction. 1 Use Case = 1 Repository.
- _Code Consistency:_ Follow project ESLint and Prettier config. Do not introduce new stylistic patterns.
- _RTK Usage:_ Always use `rtk` as a prefix for CLI commands instead of raw commands (e.g., `rtk git status`, `rtk git diff`, `rtk git log`, `rtk grep`, `rtk ls`, `rtk read`). RTK acts as a proxy that filters and compresses output to minimize token usage. Use verbosity flags (`-v`, `-vv`, `-vvv`) when needed and `-u` for ultra-compact output.

## Strict Constraints (Do NOT Do These)

- _No Generic/Fat Repositories:_ Do NOT create aggregated repository classes or interfaces (e.g., no ContactRepository holding all CRUD methods). Every database operation must have its own dedicated, single-purpose repository.
- _No Dynamic Imports:_ Avoid using dynamic imports (await import(...)) wherever possible. Always use static, top-level import statements to ensure predictable bundling and module resolution.
- _No Framework Bleed:_ Do not leak NestJS decorators (like @Injectable() or @Controller()) into the core Domain entities or pure business logic.
- _No Repositories in Domain layer :_ Do not use repositories or database access logic in the Domain layer. Repositories belong in the Infrastructure layer and their interfaces in the application layer.
- _No barrel export files (index.ts files exporting other files exports):_ Do not create index files that export other files' exports. Instead, import them directly, this confuses LLMs less and keeps code synchronised.
- _No Global EntityManager Outside Transactions:_ NEVER use this.em.findOne(), this.em.find(), or any this.em.\* database operation OUTSIDE of em.transactional(). MikroORM requires all database operations to use the forked EntityManager from em.transactional((em) => ...). If you need to do a database query, wrap it in this.em.transactional(async (em) => { ... }) or use a dedicated repository.
- _No Raw CLI Commands:_ NEVER use native CLI commands (git, grep, ls, cat, npm, pnpm, etc.) when an `rtk` equivalent exists. Always use the `rtk`-prefixed version.
- _Magic Strings or Numbers:_ Do not use magic strings or numbers in the codebase.

## Project Structure

- Each use case lives in its own folder:

```
src/application/use-cases/contact/
├── create-contact/
│   ├── create-contact.use-case.ts           # Pure business logic
│   ├── create-contact.repository.interface.ts  # Specific interface
│   ├── create-contact.request.dto.ts        # Typed input
│   ├── create-contact.response.dto.ts       # Typed output
│   └── create-contact.repository.ts         # Infrastructure implementation
├── get-contact/
├── list-contacts/
├── update-contact/
└── delete-contact/
```

- Rules:
- 1 Use Case = 1 Folder
- 1 Use Case = 1 Repository
- Do not share repository interfaces across use cases
- Always import specific files (no index.ts)

- _Real Code Example:_

```typescript
@Tool({
  name: 'add_contact',
  description: 'Crear un nuevo contacto con nombre, teléfono, email y notas opcionales',
  mode: 'business',
})
@Injectable()
export class CreateContactUseCase {
  constructor(
    @Inject('ICreateContactRepository')
    private readonly repository: ICreateContactRepository
  ) {}

  async execute(
    userId: string,
    request: CreateContactRequestDto
  ): Promise<CreateContactResponseDto> {
    if (request.phoneNumber) {
      const existsByPhone = await this.repository.existsByPhoneNumber(userId, request.phoneNumber);
      if (existsByPhone) {
        throw new ConflictException(
          `Contact with phone number ${request.phoneNumber} already exists`
        );
      }
    }

    const contact = Contact.create({
      userId,
      name: request.name,
      phoneNumber: request.phoneNumber ?? null,
      email: request.email ?? null,
      notes: request.notes ?? null,
      isBusiness: request.isBusiness ?? false,
    });

    if (request.isBlacklisted ?? false) {
      contact.blacklist();
    }

    if (request.noAutomate ?? false) {
      contact.setNoAutomate(true);
    }

    const saved = await this.repository.create(contact);
    return this.mapToResponse(saved);
  }
}
```

## Architectural Golden Rules

- _1 Use Case = 1 Repository_

```typescript
export interface ICreateContactRepository {
  create(contact: Contact): Promise<Contact>;
  existsByPhoneNumber(userId: string, phoneNumber: string): Promise<boolean>;
  existsByEmail(userId: string, email: string): Promise<boolean>;
}
```

- _No Framework Bleed_

```typescript
export default class Contact {
    private readonly _id: string;
    private readonly _userId: string;
    private _name: string;
    private _isBlacklisted: boolean = false;

    static create(props: CreateContactProps): Contact {
        return new Contact(uuidv7(), props.userId, props.name, ...);
    }

    blacklist(): void {
        this._isBlacklisted = true;
        this._updatedAt = new Date();
    }

    setNoAutomate(value: boolean): void {
        this._noAutomate = value;
        this._updatedAt = new Date();
    }
}
```

- _No Barrel Files_

```typescript
// ✅ Correct
import { CreateContactUseCase } from './use-cases/contact/create-contact/create-contact.use-case';

// ❌ Wrong
import { CreateContactUseCase } from './use-cases/contact';
```

## Development Flow

### Step 1: Contextualization (Docs First)

- Before writing code, you MUST read docs/ARCHITECTURE.md and relevant domain files.
- If documentation does not exist, your first task is to create it in docs/features/.

### Step 2: Implementation

- Create:
- Use Case
- Request DTO
- Response DTO
- Repository Interface
- Repository Implementation

- Rules:
- Business logic lives ONLY inside the use case
- Domain must remain pure
- No framework bleed

### Step 3: Verification

- You MUST always run:

```
rtk tsc --noEmit
rtk oxlint .
rtk npm test -- <use-case>
```

### Step 4: Manual QA

- If endpoint → test with curl
- If logic → run a script

### Step 5: Proofs

- Create docs/proofs/<use-case>.md including:
- Request
- Response
- Verification checklist

### Step 6: Documentation

- Update docs/CHANGELOG.md or architecture docs

## Documentation & Deep Context

Your comprehensive architectural guidelines and domain knowledge are located in the docs/ directory.

- _When to read them:_ If you are implementing a new feature, making structural changes, or are unsure about the specific implementation details of a domain, you MUST read the relevant files in docs/\*.md before writing code.
- _When to skip them:_ For minor bug fixes, typos, or localized refactoring within a single file, rely on your general knowledge to save context window.

## Obsidian Sprint Board

Project state is tracked in /Users/mauriciogenebrieres/Documents/Obsidian Vault/Localia.md — structured as a sprint board with tickets organized by date.

### End-of-Day Protocol (MANDATORY)

When the user says "end of day", "wrap up", or similar, you MUST:

1. _Read the vault_ — read(/Users/mauriciogenebrieres/Documents/Obsidian Vault/Localia.md)
2. _Inspect git state_ — git log --oneline -10 and git status on both localia/ and localia-core-api/
3. _Verify test status_ — run npm test on localia/ to confirm pass/fail count
4. _Update the vault_ — mark completed tickets, move in-progress to done or to next sprint, note blockers, update sprint board dates
5. _Commit if needed_ — if changes exist but weren't committed (user may want to review first), note them in vault but do not push without permission

### Vault Path

/Users/mauriciogenebrieres/Documents/Obsidian Vault/Localia.md

### Ticket ID Format

Prefix all ticket references with project scope:

- FE- frontend tickets (e.g., FE-001, FE-002)
- BE- backend tickets (e.g., BE-001, BE-002)
- AUTH- auth tickets
- FE-FAV- favorites-specific tickets

### Sprint Cadence

- Sprint 1: March 25, 2026
- Sprint 2: March 26, 2026
- Sprint N: rolling — any unfinished items carry forward to the next day
