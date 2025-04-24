/**
 * Testing module for basic-freedom
 * 
 * Provides a comprehensive testing framework for web applications.
 */

// Core testing API
export { test, describe, beforeEach, afterEach, beforeAll, afterAll } from './core';
export { expect } from './assertions';
export { mock, spy, stub } from './mocks';
export { run, configure } from './runner';

// UI testing
export * from './ui';

// State testing
export * from './state';

// API testing
export * from './api';

// End-to-end testing
export * from './e2e';

// WebAX integration
export * from './webax';
