#!/usr/bin/env node

/**
 * CLI for running tests
 */

import { run, configure } from './core/runner';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// Default reporter
const defaultReporter = {
  onRunStart: (testCount: number) => {
    console.log(`Running ${testCount} tests...`);
    console.log();
  },
  onSuiteStart: (suite: any) => {
    console.log(`Suite: ${suite.name}`);
  },
  onTestStart: (test: any) => {
    process.stdout.write(`  ${test.name}... `);
  },
  onTestEnd: (test: any, result: any) => {
    if (result.status === 'passed') {
      console.log('\x1b[32m%s\x1b[0m', 'PASS');
    } else if (result.status === 'failed') {
      console.log('\x1b[31m%s\x1b[0m', 'FAIL');
      console.log(`    Error: ${result.error?.message}`);
      if (result.error?.stack) {
        console.log(`    ${result.error.stack.split('\n').slice(1).join('\n    ')}`);
      }
    } else if (result.status === 'skipped') {
      console.log('\x1b[33m%s\x1b[0m', 'SKIP');
    }
  },
  onSuiteEnd: (suite: any, result: any) => {
    console.log();
  },
  onRunEnd: (result: any) => {
    console.log(`Results: ${result.passed} passed, ${result.failed} failed, ${result.skipped} skipped`);
    console.log(`Time: ${result.duration}ms`);
    
    if (result.failed > 0) {
      process.exit(1);
    }
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
const options: Record<string, any> = {
  pattern: '**/*.test.{js,ts,jsx,tsx}',
  watch: false,
  bail: false,
  timeout: 5000,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--watch' || arg === '-w') {
    options.watch = true;
  } else if (arg === '--bail' || arg === '-b') {
    options.bail = true;
  } else if (arg === '--timeout' || arg === '-t') {
    options.timeout = parseInt(args[++i], 10);
  } else if (!arg.startsWith('-')) {
    options.pattern = arg;
  }
}

// Configure the test runner
configure({
  timeout: options.timeout,
  bail: options.bail,
  reporters: [defaultReporter],
});

// Find test files
const findTestFiles = (pattern: string): string[] => {
  return glob.sync(pattern, {
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  });
};

// Run tests
const runTests = async () => {
  const testFiles = findTestFiles(options.pattern);
  
  if (testFiles.length === 0) {
    console.log(`No test files found matching pattern: ${options.pattern}`);
    return;
  }
  
  console.log(`Found ${testFiles.length} test files`);
  
  // Load test files
  for (const file of testFiles) {
    try {
      require(file);
    } catch (error) {
      console.error(`Error loading test file: ${file}`);
      console.error(error);
    }
  }
  
  // Run tests
  try {
    await run();
  } catch (error) {
    console.error('Error running tests:');
    console.error(error);
    process.exit(1);
  }
};

// Watch for changes
const watchFiles = () => {
  console.log('Watching for changes...');
  
  const testFiles = findTestFiles(options.pattern);
  const srcFiles = glob.sync('**/*.{js,ts,jsx,tsx}', {
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.{js,ts,jsx,tsx}'],
  });
  
  const allFiles = [...testFiles, ...srcFiles];
  
  for (const file of allFiles) {
    fs.watch(file, { persistent: true }, (eventType) => {
      if (eventType === 'change') {
        console.log(`\nFile changed: ${path.relative(process.cwd(), file)}`);
        runTests();
      }
    });
  }
};

// Run tests
runTests().then(() => {
  if (options.watch) {
    watchFiles();
  }
});
