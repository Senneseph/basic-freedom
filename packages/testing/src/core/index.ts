/**
 * Core testing API
 * 
 * Provides the fundamental testing functions like test, describe, beforeEach, etc.
 */

import { TestContext, TestFunction, TestSuite } from './types';

// Current test context
let currentContext: TestContext = {
  suites: [],
  currentSuite: null,
  beforeEachFns: [],
  afterEachFns: [],
  beforeAllFns: [],
  afterAllFns: [],
};

/**
 * Define a test suite
 * 
 * @param name - The name of the test suite
 * @param fn - The function containing the tests
 */
export function describe(name: string, fn: () => void): void {
  const parentSuite = currentContext.currentSuite;
  
  const suite: TestSuite = {
    name,
    tests: [],
    suites: [],
    parent: parentSuite,
    beforeEach: [],
    afterEach: [],
    beforeAll: [],
    afterAll: [],
  };
  
  if (parentSuite) {
    parentSuite.suites.push(suite);
  } else {
    currentContext.suites.push(suite);
  }
  
  // Save the previous context
  const previousSuite = currentContext.currentSuite;
  const previousBeforeEach = [...currentContext.beforeEachFns];
  const previousAfterEach = [...currentContext.afterEachFns];
  const previousBeforeAll = [...currentContext.beforeAllFns];
  const previousAfterAll = [...currentContext.afterAllFns];
  
  // Set the new context
  currentContext.currentSuite = suite;
  currentContext.beforeEachFns = [...previousBeforeEach];
  currentContext.afterEachFns = [...previousAfterEach];
  currentContext.beforeAllFns = [];
  currentContext.afterAllFns = [];
  
  // Run the suite function
  fn();
  
  // Restore the previous context
  currentContext.currentSuite = previousSuite;
  currentContext.beforeEachFns = previousBeforeEach;
  currentContext.afterEachFns = previousAfterEach;
  currentContext.beforeAllFns = previousBeforeAll;
  currentContext.afterAllFns = previousAfterAll;
}

/**
 * Define a test case
 * 
 * @param name - The name of the test
 * @param fn - The test function
 */
export function test(name: string, fn: TestFunction): void {
  if (!currentContext.currentSuite) {
    throw new Error('Test must be defined within a describe block');
  }
  
  currentContext.currentSuite.tests.push({
    name,
    fn,
    skip: false,
    only: false,
  });
}

/**
 * Define a test case (alias for test)
 */
export const it = test;

/**
 * Skip this test
 * 
 * @param name - The name of the test
 * @param fn - The test function
 */
test.skip = (name: string, fn: TestFunction): void => {
  if (!currentContext.currentSuite) {
    throw new Error('Test must be defined within a describe block');
  }
  
  currentContext.currentSuite.tests.push({
    name,
    fn,
    skip: true,
    only: false,
  });
};

/**
 * Only run this test
 * 
 * @param name - The name of the test
 * @param fn - The test function
 */
test.only = (name: string, fn: TestFunction): void => {
  if (!currentContext.currentSuite) {
    throw new Error('Test must be defined within a describe block');
  }
  
  currentContext.currentSuite.tests.push({
    name,
    fn,
    skip: false,
    only: true,
  });
};

/**
 * Run before each test in the current describe block
 * 
 * @param fn - The function to run before each test
 */
export function beforeEach(fn: TestFunction): void {
  if (!currentContext.currentSuite) {
    throw new Error('beforeEach must be defined within a describe block');
  }
  
  currentContext.beforeEachFns.push(fn);
  currentContext.currentSuite.beforeEach.push(fn);
}

/**
 * Run after each test in the current describe block
 * 
 * @param fn - The function to run after each test
 */
export function afterEach(fn: TestFunction): void {
  if (!currentContext.currentSuite) {
    throw new Error('afterEach must be defined within a describe block');
  }
  
  currentContext.afterEachFns.push(fn);
  currentContext.currentSuite.afterEach.push(fn);
}

/**
 * Run once before all tests in the current describe block
 * 
 * @param fn - The function to run before all tests
 */
export function beforeAll(fn: TestFunction): void {
  if (!currentContext.currentSuite) {
    throw new Error('beforeAll must be defined within a describe block');
  }
  
  currentContext.beforeAllFns.push(fn);
  currentContext.currentSuite.beforeAll.push(fn);
}

/**
 * Run once after all tests in the current describe block
 * 
 * @param fn - The function to run after all tests
 */
export function afterAll(fn: TestFunction): void {
  if (!currentContext.currentSuite) {
    throw new Error('afterAll must be defined within a describe block');
  }
  
  currentContext.afterAllFns.push(fn);
  currentContext.currentSuite.afterAll.push(fn);
}

// Export the current context for the runner
export function getContext(): TestContext {
  return currentContext;
}

// Reset the context (used by the runner)
export function resetContext(): void {
  currentContext = {
    suites: [],
    currentSuite: null,
    beforeEachFns: [],
    afterEachFns: [],
    beforeAllFns: [],
    afterAllFns: [],
  };
}
