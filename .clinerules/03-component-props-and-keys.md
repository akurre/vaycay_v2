# Component Props and Keys

## Intent
Maintain clean, readable component code by using destructured props and meaningful React keys.

## Scope
- Applies to all React components in the client directory.

## Requirements

### Prop Destructuring
- **ALWAYS** destructure props in the function signature.
- **NEVER** use a `Props` parameter that requires accessing properties via `Props.propertyName`.

**Correct:**
```tsx
const MapPopup = ({ city }: PopupProps) => {
  const weatherItems = formatWeatherData(city);
  return <div>{city.name}</div>;
};
```

**Incorrect:**
```tsx
const MapPopup = (Props: PopupProps) => {
  const weatherItems = formatWeatherData(Props.city);
  return <div>{Props.city.name}</div>;
};
```

### React Keys in Lists
- **NEVER** use array index as a key in `.map()` operations.
- **ALWAYS** use a stable, unique identifier from the data itself.
- Prefer properties like `id`, `label`, `name`, or other unique identifiers.

**Correct:**
```tsx
{weatherItems.map((item) => (
  <Text key={item.label} size="sm">
    {item.label}: {item.value}
  </Text>
))}
```

**Incorrect:**
```tsx
{weatherItems.map((item, index) => (
  <Text key={index} size="sm">
    {item.label}: {item.value}
  </Text>
))}
```

## Rationale
- **Prop Destructuring**: Reduces verbosity, improves readability, and follows React best practices.
- **Meaningful Keys**: Using index as a key can cause rendering issues when items are reordered, added, or removed. Stable identifiers ensure React can properly track and update components.

## Exceptions
- If data truly has no unique identifier and the list is static (never reordered/filtered), index may be acceptable, but this should be rare and documented with a comment explaining why.

## Cline Guidance
- When creating new components, always use destructured props.
- When refactoring components, convert `Props.x` patterns to destructured props.
- When mapping over arrays, identify the most appropriate unique property to use as a key.
- If you see `key={index}`, replace it with a meaningful identifier from the data.
