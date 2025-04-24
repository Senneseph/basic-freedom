# basic-freedom

A comprehensive standard library for modern web applications, with a focus on simplicity, performance, and developer experience.

## Overview

`basic-freedom` provides essential utilities and tools for building web applications, including:

- Testing framework
- Data structures
- Utility functions
- Type definitions
- Common algorithms
- Internationalization
- Validation
- Error handling

## Installation

```bash
npm install basic-freedom
```

## Usage

```javascript
// Import specific modules
import { testing } from "basic-freedom";
import { collections } from "basic-freedom";
import { validation } from "basic-freedom";

// Or import specific functions
import { test, expect } from "basic-freedom/testing";
import { HashMap, Queue } from "basic-freedom/collections";
import { validateEmail, validatePassword } from "basic-freedom/validation";
```

## Modules

### Testing

The testing module provides a comprehensive testing framework for web applications:

```javascript
import { test, describe, expect } from "basic-freedom/testing";

describe("Calculator", () => {
  test("adds two numbers", () => {
    const calculator = new Calculator();
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });
});
```

See the [Testing Documentation](./docs/testing.md) for more details.

### Collections

The collections module provides efficient data structures:

```javascript
import { HashMap, Queue, Stack, LinkedList } from "basic-freedom/collections";

// Create a hash map
const map = new HashMap();
map.set("key", "value");
console.log(map.get("key")); // "value"

// Create a queue
const queue = new Queue();
queue.enqueue("item1");
queue.enqueue("item2");
console.log(queue.dequeue()); // "item1"
```

See the [Collections Documentation](./docs/collections.md) for more details.

### Validation

The validation module provides utilities for validating data:

```javascript
import { validateEmail, validatePassword } from "basic-freedom/validation";

console.log(validateEmail("user@example.com")); // true
console.log(validatePassword("password123")); // false (too weak)
```

See the [Validation Documentation](./docs/validation.md) for more details.

### Internationalization

The internationalization module provides utilities for internationalization:

```javascript
import { createI18n } from "basic-freedom/i18n";

const i18n = createI18n({
  en: {
    greeting: "Hello, {name}!",
  },
  fr: {
    greeting: "Bonjour, {name}!",
  },
});

console.log(i18n.t("greeting", { name: "John" })); // "Hello, John!"
i18n.setLocale("fr");
console.log(i18n.t("greeting", { name: "John" })); // "Bonjour, John!"
```

See the [Internationalization Documentation](./docs/i18n.md) for more details.

### Error Handling

The error handling module provides utilities for handling errors:

```javascript
import { createErrorBoundary, ErrorBoundary } from "basic-freedom/errors";

// Function error boundary
const fetchData = createErrorBoundary(async () => {
  // Fetch data
}, {
  onError: (error) => {
    console.error("Failed to fetch data:", error);
  },
  fallback: () => {
    return { data: [] };
  },
});

// Component error boundary
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

See the [Error Handling Documentation](./docs/errors.md) for more details.

## Contributing

Contributions are welcome! Please see the [Contributing Guide](./CONTRIBUTING.md) for more details.

## License

MIT
