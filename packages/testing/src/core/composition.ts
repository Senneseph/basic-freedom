/**
 * Composition utilities for testing
 * 
 * Provides utilities for composing test fixtures and utilities.
 */

import { TestFunction } from './types';

/**
 * Compose test fixtures
 * 
 * @param fns - The functions to compose
 * @returns A function that composes the given functions
 */
export function compose(...fns: Array<(test: TestFunction) => TestFunction>): (test: TestFunction) => TestFunction {
  return (test) => fns.reduceRight((acc, fn) => fn(acc), test);
}

/**
 * Create a test fixture
 * 
 * @param setup - The setup function
 * @param teardown - The teardown function
 * @returns A function that applies the fixture to a test
 */
export function fixture<T>(
  setup: () => T,
  teardown?: (context: T) => void | Promise<void>
): (test: TestFunction) => TestFunction {
  return (test) => async (...args: any[]) => {
    const context = setup();
    try {
      await test(...args, context);
    } finally {
      if (teardown) {
        await teardown(context);
      }
    }
  };
}

/**
 * Create a test fixture with async setup
 * 
 * @param setup - The async setup function
 * @param teardown - The teardown function
 * @returns A function that applies the fixture to a test
 */
export function asyncFixture<T>(
  setup: () => Promise<T>,
  teardown?: (context: T) => void | Promise<void>
): (test: TestFunction) => TestFunction {
  return (test) => async (...args: any[]) => {
    const context = await setup();
    try {
      await test(...args, context);
    } finally {
      if (teardown) {
        await teardown(context);
      }
    }
  };
}

/**
 * Create a test fixture that provides a value
 * 
 * @param value - The value to provide
 * @returns A function that applies the fixture to a test
 */
export function provide<T>(value: T): (test: TestFunction) => TestFunction {
  return (test) => async (...args: any[]) => {
    await test(...args, value);
  };
}

/**
 * Create a test fixture that provides multiple values
 * 
 * @param values - The values to provide
 * @returns A function that applies the fixture to a test
 */
export function provideMany(...values: any[]): (test: TestFunction) => TestFunction {
  return (test) => async (...args: any[]) => {
    await test(...args, ...values);
  };
}
