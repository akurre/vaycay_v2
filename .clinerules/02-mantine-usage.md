# Mantine Usage Guidelines

## Intent
Use Mantine only for interactive UI components, not for layout or structural elements.

## Scope
- Applies to all TypeScript/JavaScript in the client directory.

## Requirements
- **DO USE** Mantine for interactive components and content elements:
  - Interactive components:
    - `Button`
    - `Select`
    - `TextInput`
    - `Checkbox`
    - `Radio`
    - `Switch`
    - `Slider`
    - `Modal`
    - `Menu`
    - `Tabs`
    - Other form controls and interactive elements
  - Content components:
    - `Title` (for headings)
    - `Text` (for paragraphs and text content)
    - `Alert` (for notifications and messages)
    - `Loader` (for loading states)
    - Other content display components

- **DO NOT USE** Mantine for layout components:
  - `Group`
  - `Stack`
  - `Container`
  - `Grid`
  - `Flex`
  - `Center`
  - `Box`
  - `Space`
  - Other layout/spacing components

- Use standard HTML elements (`div`, `section`, etc.) with Tailwind CSS classes for layout and spacing instead.

## Rationale
- Keeps layout flexible and maintainable with Tailwind
- Reduces dependency on Mantine's layout system
- Maintains consistency with existing Tailwind-based layouts
- Allows for easier customization of spacing and positioning

## Example (Correct)
```tsx
// Good: Using Mantine for interactive components only
<form onSubmit={handleSubmit}>
  <div className="flex gap-4 mt-8">
    <Select
      placeholder="Month"
      data={monthOptions}
      value={month}
      onChange={setMonth}
    />
    <Button type="submit">Submit</Button>
  </div>
</form>
```

## Example (Incorrect)
```tsx
// Bad: Using Mantine layout components
<form onSubmit={handleSubmit}>
  <Group mt="xl" gap="md">
    <Select
      placeholder="Month"
      data={monthOptions}
      value={month}
      onChange={setMonth}
    />
    <Button type="submit">Submit</Button>
  </Group>
</form>
