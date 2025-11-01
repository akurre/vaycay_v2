# Proper TypeScript Typing

## Intent
Maintain strict type safety throughout the codebase by avoiding type workarounds and ensuring function signatures accurately reflect their implementation.

## Scope
- Applies to all TypeScript code in the client and server directories
- Includes function signatures, type definitions, and test code

## Requirements

### Never Use `any` Type
- **NEVER** use the `any` type in production code or tests
- The `any` type defeats the purpose of TypeScript and should be avoided at all costs
- If you encounter a situation where you think `any` is needed, there is always a better solution

### Avoid Type Casting Workarounds
- **DO NOT** use type casting workarounds like:
  - `as any`
  - `as unknown as SomeType`
  - `@ts-expect-error` (except in very rare, documented cases)
  - `@ts-ignore`

### Match Function Signatures to Implementation
- Function signatures must accurately reflect what the function actually handles
- If a function handles `null` or `undefined`, include these in the type signature
- If a function handles multiple types, use union types appropriately

**Incorrect:**
```typescript
// Function signature says it only accepts string
function processValue(value: string): number {
  // But implementation handles null/undefined
  if (!value) return 0;
  return value.length;
}

// Test uses hacky type casting
expect(processValue(null as any)).toBe(0);
```

**Correct:**
```typescript
// Function signature accurately reflects what it handles
function processValue(value: string | null | undefined): number {
  if (!value) return 0;
  return value.length;
}

// Test uses proper types
expect(processValue(null)).toBe(0);
```

### Check Context Before Typing
- Always examine the actual implementation of a function before writing tests or using it
- Understand what types the function truly accepts and handles
- Update function signatures to match reality rather than forcing types in tests

### Use Proper Type Narrowing
- Use type guards and narrowing instead of type assertions
- Leverage TypeScript's built-in type narrowing capabilities

**Good practices:**
```typescript
// Union types for multiple valid types
function format(value: string | number): string {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value;
}

// Optional parameters
function greet(name?: string): string {
  return name ? `Hello, ${name}` : 'Hello';
}

// Nullable types
function findUser(id: string): User | null {
  // implementation
}
```

### Testing Invalid Inputs
- If you need to test how a function handles invalid inputs, update the function signature to accept those inputs
- Don't use type workarounds to force invalid types into tests
- If a function shouldn't accept certain types, don't test those scenarios - let TypeScript prevent them

## Rationale
- Type safety is one of TypeScript's primary benefits
- Accurate type signatures serve as documentation
- Proper typing catches bugs at compile time rather than runtime
- Type workarounds hide potential issues and make code harder to maintain
- Tests should reflect real-world usage, not force invalid scenarios

## Exceptions
- Very rare cases where external library types are incorrect (document with comment explaining why)
- Generated code that cannot be modified (isolate and wrap with proper types)

## Cline Guidance
- When you see `any` in code, replace it with proper types
- When writing tests, check the function signature first
- If the signature doesn't match what the function handles, fix the signature
- Never use type casting as a shortcut - always find the proper solution
- If you're tempted to use `as any`, stop and find the correct type instead
