/**
 * Testing module for basic-freedom
 * 
 * Provides a comprehensive testing framework for WebAXP applications.
 */

// Core testing API
export { test, describe, beforeEach, afterEach, beforeAll, afterAll } from './core';
export { expect } from './assertions';
export { mock, spy, stub } from './mocks';
export { run, configure } from './core/runner';

// Composition utilities
export { compose, fixture } from './core/composition';

// Re-export submodules for direct access
import * as ui from './ui';
import * as webaxp from './webaxp';

export { ui, webaxp };
