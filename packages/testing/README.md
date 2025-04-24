# @basic-freedom/testing

A functional, composable, and readable testing framework for WebAXP applications.

## Overview

The `@basic-freedom/testing` package provides a comprehensive testing framework designed specifically for WebAXP applications. It emphasizes:

- **Functional**: Based on pure functions and immutability
- **Composable**: Allows for easy composition of test fixtures and utilities
- **Readable**: Uses a clear, expressive syntax

## Installation

```bash
npm install @basic-freedom/testing
```

## Usage

```javascript
import { test, expect } from "@basic-freedom/testing";

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});
```

## Features

### Core Testing API

```javascript
import { test, describe, beforeEach, afterEach } from "@basic-freedom/testing";

describe("Calculator", () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test("adds two numbers", () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  test("subtracts two numbers", () => {
    const result = calculator.subtract(5, 3);
    expect(result).toBe(2);
  });
});
```

### Assertions

```javascript
import { expect } from "@basic-freedom/testing";

// Basic assertions
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Type assertions
expect(value).toBeType("string");
expect(value).toBeInstanceOf(Class);

// Custom assertions
expect(value).to(v => v > 0, "Value should be positive");
```

### UI Testing

```javascript
import { test, expect } from "@basic-freedom/testing";
import { render, userEvent } from "@basic-freedom/testing/ui";

test("user can add a todo item", async () => {
  const { getByText, getByPlaceholderText } = render(<TodoApp />);
  
  await userEvent.type(getByPlaceholderText("Add todo"), "Buy milk");
  await userEvent.click(getByText("Add"));
  
  expect(getByText("Buy milk")).toBeTruthy();
});
```

### WebAXP Testing

```javascript
import { test, expect } from "@basic-freedom/testing";
import { createTestApp } from "@basic-freedom/testing/webaxp";

test("WebAXP application renders correctly", () => {
  const app = createTestApp({
    // Configuration
  });
  
  app.navigate("/products");
  
  expect(app.getRenderedComponents()).toContain("ProductList");
});
```

### Composable Tests

```javascript
import { test } from "@basic-freedom/testing";
import { compose, fixture } from "@basic-freedom/testing/core";

const withUser = fixture(() => ({ user: createTestUser() }));
const withDatabase = fixture(() => ({ db: createTestDatabase() }), ({ db }) => db.close());

const testWithUserAndDb = compose(withUser, withDatabase)(
  async (props, { user }, { db }) => {
    // Test using user and db
    await db.saveUser(user);
    expect(await db.getUser(user.id)).toEqual(user);
  }
);
```

## API Reference

See the [API Reference](./docs/api.md) for detailed documentation of the testing API.

## Examples

See the [Examples](./examples) directory for example tests using the framework.

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md) for more details.
