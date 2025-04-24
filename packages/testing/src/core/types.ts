/**
 * Types for the testing framework
 */

/**
 * A test function
 */
export type TestFunction = (...args: any[]) => void | Promise<void>;

/**
 * A test case
 */
export interface Test {
  name: string;
  fn: TestFunction;
  skip: boolean;
  only: boolean;
}

/**
 * A test suite
 */
export interface TestSuite {
  name: string;
  tests: Test[];
  suites: TestSuite[];
  parent: TestSuite | null;
  beforeEach: TestFunction[];
  afterEach: TestFunction[];
  beforeAll: TestFunction[];
  afterAll: TestFunction[];
}

/**
 * The test context
 */
export interface TestContext {
  suites: TestSuite[];
  currentSuite: TestSuite | null;
  beforeEachFns: TestFunction[];
  afterEachFns: TestFunction[];
  beforeAllFns: TestFunction[];
  afterAllFns: TestFunction[];
}

/**
 * Test result status
 */
export enum TestStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

/**
 * Test result
 */
export interface TestResult {
  name: string;
  status: TestStatus;
  error?: Error;
  duration: number;
}

/**
 * Test suite result
 */
export interface TestSuiteResult {
  name: string;
  tests: TestResult[];
  suites: TestSuiteResult[];
  duration: number;
}

/**
 * Test run result
 */
export interface TestRunResult {
  suites: TestSuiteResult[];
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

/**
 * Test runner configuration
 */
export interface TestRunnerConfig {
  timeout?: number;
  bail?: boolean;
  reporters?: Reporter[];
}

/**
 * Test reporter
 */
export interface Reporter {
  onRunStart?: (testCount: number) => void;
  onSuiteStart?: (suite: TestSuite) => void;
  onTestStart?: (test: Test) => void;
  onTestEnd?: (test: Test, result: TestResult) => void;
  onSuiteEnd?: (suite: TestSuite, result: TestSuiteResult) => void;
  onRunEnd?: (result: TestRunResult) => void;
}
