/**
 * Test runner
 * 
 * Runs tests and reports results.
 */

import { getContext, resetContext } from './index';
import {
  Test,
  TestSuite,
  TestFunction,
  TestResult,
  TestSuiteResult,
  TestRunResult,
  TestStatus,
  TestRunnerConfig,
  Reporter,
} from './types';

// Default configuration
const defaultConfig: TestRunnerConfig = {
  timeout: 5000,
  bail: false,
  reporters: [],
};

// Current configuration
let config: TestRunnerConfig = { ...defaultConfig };

/**
 * Configure the test runner
 * 
 * @param newConfig - The new configuration
 */
export function configure(newConfig: Partial<TestRunnerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Run a test
 * 
 * @param test - The test to run
 * @param beforeEachFns - The beforeEach functions
 * @param afterEachFns - The afterEach functions
 * @returns The test result
 */
async function runTest(
  test: Test,
  beforeEachFns: TestFunction[],
  afterEachFns: TestFunction[]
): Promise<TestResult> {
  if (test.skip) {
    return {
      name: test.name,
      status: TestStatus.SKIPPED,
      duration: 0,
    };
  }

  // Notify reporters
  config.reporters?.forEach((reporter) => {
    reporter.onTestStart?.(test);
  });

  const startTime = Date.now();
  let error: Error | undefined;

  try {
    // Run beforeEach functions
    for (const beforeEach of beforeEachFns) {
      await beforeEach();
    }

    // Run the test with a timeout
    await Promise.race([
      test.fn(),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Test timed out after ${config.timeout}ms`));
        }, config.timeout);
      }),
    ]);

    // Run afterEach functions
    for (const afterEach of afterEachFns) {
      await afterEach();
    }
  } catch (e) {
    error = e as Error;
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  const result: TestResult = {
    name: test.name,
    status: error ? TestStatus.FAILED : TestStatus.PASSED,
    error,
    duration,
  };

  // Notify reporters
  config.reporters?.forEach((reporter) => {
    reporter.onTestEnd?.(test, result);
  });

  return result;
}

/**
 * Run a test suite
 * 
 * @param suite - The suite to run
 * @param parentBeforeEach - The parent beforeEach functions
 * @param parentAfterEach - The parent afterEach functions
 * @returns The suite result
 */
async function runSuite(
  suite: TestSuite,
  parentBeforeEach: TestFunction[] = [],
  parentAfterEach: TestFunction[] = []
): Promise<TestSuiteResult> {
  // Notify reporters
  config.reporters?.forEach((reporter) => {
    reporter.onSuiteStart?.(suite);
  });

  const startTime = Date.now();

  // Combine beforeEach and afterEach functions
  const beforeEachFns = [...parentBeforeEach, ...suite.beforeEach];
  const afterEachFns = [...suite.afterEach, ...parentAfterEach];

  // Run beforeAll functions
  for (const beforeAll of suite.beforeAll) {
    await beforeAll();
  }

  // Run tests
  const testResults: TestResult[] = [];
  const onlyTests = suite.tests.filter((test) => test.only);
  const testsToRun = onlyTests.length > 0 ? onlyTests : suite.tests;

  for (const test of testsToRun) {
    const result = await runTest(test, beforeEachFns, afterEachFns);
    testResults.push(result);

    // Bail if configured and test failed
    if (config.bail && result.status === TestStatus.FAILED) {
      break;
    }
  }

  // Run suites
  const suiteResults: TestSuiteResult[] = [];
  const onlySuites = suite.suites.filter((s) => s.tests.some((t) => t.only) || s.suites.some((s) => s.tests.some((t) => t.only)));
  const suitesToRun = onlySuites.length > 0 ? onlySuites : suite.suites;

  for (const childSuite of suitesToRun) {
    const result = await runSuite(childSuite, beforeEachFns, afterEachFns);
    suiteResults.push(result);

    // Bail if configured and any test in the suite failed
    if (config.bail && result.failed > 0) {
      break;
    }
  }

  // Run afterAll functions
  for (const afterAll of suite.afterAll) {
    await afterAll();
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  const result: TestSuiteResult = {
    name: suite.name,
    tests: testResults,
    suites: suiteResults,
    duration,
  };

  // Notify reporters
  config.reporters?.forEach((reporter) => {
    reporter.onSuiteEnd?.(suite, result);
  });

  return result;
}

/**
 * Run all tests
 * 
 * @returns The test run result
 */
export async function run(): Promise<TestRunResult> {
  const context = getContext();
  const suites = context.suites;

  // Count total tests
  const countTests = (suite: TestSuite): number => {
    return suite.tests.length + suite.suites.reduce((count, s) => count + countTests(s), 0);
  };

  const testCount = suites.reduce((count, suite) => count + countTests(suite), 0);

  // Notify reporters
  config.reporters?.forEach((reporter) => {
    reporter.onRunStart?.(testCount);
  });

  const startTime = Date.now();

  // Run suites
  const suiteResults: TestSuiteResult[] = [];
  const onlySuites = suites.filter((s) => s.tests.some((t) => t.only) || s.suites.some((s) => s.tests.some((t) => t.only)));
  const suitesToRun = onlySuites.length > 0 ? onlySuites : suites;

  for (const suite of suitesToRun) {
    const result = await runSuite(suite);
    suiteResults.push(result);

    // Bail if configured and any test in the suite failed
    if (config.bail && result.failed > 0) {
      break;
    }
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Count results
  const countResults = (suite: TestSuiteResult): { passed: number; failed: number; skipped: number } => {
    const testCounts = suite.tests.reduce(
      (counts, test) => {
        if (test.status === TestStatus.PASSED) counts.passed++;
        else if (test.status === TestStatus.FAILED) counts.failed++;
        else if (test.status === TestStatus.SKIPPED) counts.skipped++;
        return counts;
      },
      { passed: 0, failed: 0, skipped: 0 }
    );

    const suiteCounts = suite.suites.reduce(
      (counts, s) => {
        const subCounts = countResults(s);
        counts.passed += subCounts.passed;
        counts.failed += subCounts.failed;
        counts.skipped += subCounts.skipped;
        return counts;
      },
      { passed: 0, failed: 0, skipped: 0 }
    );

    return {
      passed: testCounts.passed + suiteCounts.passed,
      failed: testCounts.failed + suiteCounts.failed,
      skipped: testCounts.skipped + suiteCounts.skipped,
    };
  };

  const counts = suiteResults.reduce(
    (counts, suite) => {
      const subCounts = countResults(suite);
      counts.passed += subCounts.passed;
      counts.failed += subCounts.failed;
      counts.skipped += subCounts.skipped;
      return counts;
    },
    { passed: 0, failed: 0, skipped: 0 }
  );

  const result: TestRunResult = {
    suites: suiteResults,
    ...counts,
    duration,
  };

  // Notify reporters
  config.reporters?.forEach((reporter) => {
    reporter.onRunEnd?.(result);
  });

  // Reset the context
  resetContext();

  return result;
}
