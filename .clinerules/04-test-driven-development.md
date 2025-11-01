# Test-Driven Development

## Intent
Ensure all new functionality is properly tested by requiring tests to be written alongside new code.

## Scope
- Applies to all new TypeScript/JavaScript code in the client directory
- Includes utilities, components, hooks, and stores

## Requirements

### When to Write Tests
Write tests **immediately after** creating any of the following:
- New utility functions
- New React components
- New custom hooks
- New store logic
- New API integration code

### Test Location
- Tests must be placed in `client/src/tests/` following the mirror structure of `client/src/`
- Example: `client/src/utils/map/getMarkerColor.ts` → `client/src/tests/utils/map/getMarkerColor.test.ts`

### Test Conventions
Follow the established testing conventions documented in `client/src/tests/README.md`:

1. **Import Conventions**
   - Always use absolute imports with `@/` prefix
   - Example: `import { formatTemperature } from '@/utils/tempFormatting/formatTemperature';`

2. **Test File Naming**
   - Name test files as `[filename].test.ts` or `[filename].test.tsx`
   - Place in corresponding location within `client/src/tests/`

3. **Test Structure**
   - Use `describe` blocks to group related tests
   - Write descriptive test names that clearly state what is being tested
   - Test both happy paths and edge cases

4. **Utility Function Tests**
   - Test expected behavior with valid inputs
   - Test edge cases (null, undefined, empty strings, etc.)
   - Test boundary values
   - Test error handling

5. **Component Tests**
   - Use the custom `render` function from `@/test-utils`
   - Test rendering with different props
   - Test user interactions
   - Test conditional rendering

6. **Hook Tests**
   - Use `renderHook` from `@testing-library/react`
   - Test initial state
   - Test state updates with `act()`
   - Test side effects

7. **Store Tests**
   - Reset state before each test using `beforeEach`
   - Test initial state
   - Test state mutations
   - Test computed values

### Coverage Requirements
- Aim for comprehensive test coverage of new functionality
- Tests should cover:
  - Normal operation (happy path)
  - Edge cases and boundary conditions
  - Error conditions
  - Null/undefined handling
  - Type validation where applicable

### Test Quality
- Tests should be clear and readable
- Each test should focus on a single behavior
- Use meaningful variable names and test descriptions
- Avoid testing implementation details; focus on behavior
- Keep tests isolated and independent

## Examples

### Utility Function Test
```typescript
import { describe, it, expect } from 'vitest';
import { formatTemperature } from '@/utils/tempFormatting/formatTemperature';

describe('formatTemperature', () => {
  it('formats positive temperature correctly', () => {
    expect(formatTemperature(25.5)).toBe('25.5°C');
  });

  it('returns null for null input', () => {
    expect(formatTemperature(null)).toBeNull();
  });

  it('handles negative temperatures', () => {
    expect(formatTemperature(-10)).toBe('-10°C');
  });
});
```

### Component Test
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import Field from '@/components/CityPopup/Field';

describe('Field', () => {
  it('renders label and value correctly', () => {
    render(<Field label="Temperature" value="25.5°C" />);
    
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25.5°C')).toBeInTheDocument();
  });
});
```

### Hook Test
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMapInteractions } from '@/hooks/useMapInteractions';

describe('useMapInteractions', () => {
  it('initializes with null selectedCity', () => {
    const { result } = renderHook(() => useMapInteractions([], 'markers'));
    
    expect(result.current.selectedCity).toBeNull();
  });
});
```

## Workflow

1. **Create new functionality** (utility, component, hook, etc.)
2. **Immediately create corresponding test file** in `client/src/tests/`
3. **Write comprehensive tests** covering normal operation and edge cases
4. **Run tests** to ensure they pass: `npm test` or `make test`
5. **Verify coverage** if needed: `npm run test:coverage`

## Exceptions

- Simple type definitions or interfaces typically don't need tests
- Configuration files don't need tests
- Files that only re-export other modules don't need tests

## Benefits

- Catches bugs early in development
- Documents expected behavior
- Makes refactoring safer
- Improves code quality
- Maintains high test coverage

## Cline Guidance

When creating new functionality:
1. Write the implementation code
2. Immediately create the test file following the conventions above
3. Write comprehensive tests before moving to the next task
4. Ensure tests pass before considering the task complete
