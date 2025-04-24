/**
 * Assertions module
 * 
 * Provides utilities for making assertions in tests.
 */

/**
 * Create an expectation on a value
 * 
 * @param actual - The actual value
 * @returns An object with assertion methods
 */
export function expect<T>(actual: T) {
  return {
    /**
     * Assert that the value equals the expected value
     * 
     * @param expected - The expected value
     */
    toBe(expected: T): void {
      if (actual !== expected) {
        throw new Error(`Expected ${formatValue(actual)} to be ${formatValue(expected)}`);
      }
    },
    
    /**
     * Assert that the value deeply equals the expected value
     * 
     * @param expected - The expected value
     */
    toEqual(expected: T): void {
      if (!deepEqual(actual, expected)) {
        throw new Error(`Expected ${formatValue(actual)} to equal ${formatValue(expected)}`);
      }
    },
    
    /**
     * Assert that the value is truthy
     */
    toBeTruthy(): void {
      if (!actual) {
        throw new Error(`Expected ${formatValue(actual)} to be truthy`);
      }
    },
    
    /**
     * Assert that the value is falsy
     */
    toBeFalsy(): void {
      if (actual) {
        throw new Error(`Expected ${formatValue(actual)} to be falsy`);
      }
    },
    
    /**
     * Assert that the value is null
     */
    toBeNull(): void {
      if (actual !== null) {
        throw new Error(`Expected ${formatValue(actual)} to be null`);
      }
    },
    
    /**
     * Assert that the value is undefined
     */
    toBeUndefined(): void {
      if (actual !== undefined) {
        throw new Error(`Expected ${formatValue(actual)} to be undefined`);
      }
    },
    
    /**
     * Assert that the value is defined (not undefined)
     */
    toBeDefined(): void {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    
    /**
     * Assert that the value is NaN
     */
    toBeNaN(): void {
      if (!Number.isNaN(actual)) {
        throw new Error(`Expected ${formatValue(actual)} to be NaN`);
      }
    },
    
    /**
     * Assert that the value is of a specific type
     * 
     * @param type - The expected type
     */
    toBeType(type: string): void {
      if (typeof actual !== type) {
        throw new Error(`Expected ${formatValue(actual)} to be of type ${type}, but got ${typeof actual}`);
      }
    },
    
    /**
     * Assert that the value is an instance of a specific class
     * 
     * @param constructor - The expected constructor
     */
    toBeInstanceOf(constructor: Function): void {
      if (!(actual instanceof constructor)) {
        throw new Error(`Expected ${formatValue(actual)} to be an instance of ${constructor.name}`);
      }
    },
    
    /**
     * Assert that the value is greater than the expected value
     * 
     * @param expected - The expected value
     */
    toBeGreaterThan(expected: number): void {
      if (typeof actual !== 'number') {
        throw new Error(`Expected ${formatValue(actual)} to be a number`);
      }
      if (actual <= expected) {
        throw new Error(`Expected ${formatValue(actual)} to be greater than ${formatValue(expected)}`);
      }
    },
    
    /**
     * Assert that the value is greater than or equal to the expected value
     * 
     * @param expected - The expected value
     */
    toBeGreaterThanOrEqual(expected: number): void {
      if (typeof actual !== 'number') {
        throw new Error(`Expected ${formatValue(actual)} to be a number`);
      }
      if (actual < expected) {
        throw new Error(`Expected ${formatValue(actual)} to be greater than or equal to ${formatValue(expected)}`);
      }
    },
    
    /**
     * Assert that the value is less than the expected value
     * 
     * @param expected - The expected value
     */
    toBeLessThan(expected: number): void {
      if (typeof actual !== 'number') {
        throw new Error(`Expected ${formatValue(actual)} to be a number`);
      }
      if (actual >= expected) {
        throw new Error(`Expected ${formatValue(actual)} to be less than ${formatValue(expected)}`);
      }
    },
    
    /**
     * Assert that the value is less than or equal to the expected value
     * 
     * @param expected - The expected value
     */
    toBeLessThanOrEqual(expected: number): void {
      if (typeof actual !== 'number') {
        throw new Error(`Expected ${formatValue(actual)} to be a number`);
      }
      if (actual > expected) {
        throw new Error(`Expected ${formatValue(actual)} to be less than or equal to ${formatValue(expected)}`);
      }
    },
    
    /**
     * Assert that the value is close to the expected value
     * 
     * @param expected - The expected value
     * @param precision - The precision (number of decimal places)
     */
    toBeCloseTo(expected: number, precision: number = 2): void {
      if (typeof actual !== 'number') {
        throw new Error(`Expected ${formatValue(actual)} to be a number`);
      }
      const factor = Math.pow(10, precision);
      const actualRounded = Math.round(actual * factor) / factor;
      const expectedRounded = Math.round(expected * factor) / factor;
      if (actualRounded !== expectedRounded) {
        throw new Error(`Expected ${formatValue(actual)} to be close to ${formatValue(expected)} with precision ${precision}`);
      }
    },
    
    /**
     * Assert that the value matches a pattern
     * 
     * @param pattern - The expected pattern
     */
    toMatch(pattern: RegExp | string): void {
      if (typeof actual !== 'string') {
        throw new Error(`Expected ${formatValue(actual)} to be a string`);
      }
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      if (!regex.test(actual)) {
        throw new Error(`Expected ${formatValue(actual)} to match ${formatValue(pattern)}`);
      }
    },
    
    /**
     * Assert that the value starts with the expected prefix
     * 
     * @param prefix - The expected prefix
     */
    toStartWith(prefix: string): void {
      if (typeof actual !== 'string') {
        throw new Error(`Expected ${formatValue(actual)} to be a string`);
      }
      if (!actual.startsWith(prefix)) {
        throw new Error(`Expected ${formatValue(actual)} to start with ${formatValue(prefix)}`);
      }
    },
    
    /**
     * Assert that the value ends with the expected suffix
     * 
     * @param suffix - The expected suffix
     */
    toEndWith(suffix: string): void {
      if (typeof actual !== 'string') {
        throw new Error(`Expected ${formatValue(actual)} to be a string`);
      }
      if (!actual.endsWith(suffix)) {
        throw new Error(`Expected ${formatValue(actual)} to end with ${formatValue(suffix)}`);
      }
    },
    
    /**
     * Assert that the value contains the expected substring
     * 
     * @param substring - The expected substring
     */
    toContain(substring: string): void {
      if (typeof actual !== 'string' && !Array.isArray(actual)) {
        throw new Error(`Expected ${formatValue(actual)} to be a string or array`);
      }
      if (typeof actual === 'string' && !actual.includes(substring)) {
        throw new Error(`Expected ${formatValue(actual)} to contain ${formatValue(substring)}`);
      }
      if (Array.isArray(actual) && !actual.includes(substring as any)) {
        throw new Error(`Expected ${formatValue(actual)} to contain ${formatValue(substring)}`);
      }
    },
    
    /**
     * Assert that the array contains an item that equals the expected item
     * 
     * @param item - The expected item
     */
    toContainEqual(item: any): void {
      if (!Array.isArray(actual)) {
        throw new Error(`Expected ${formatValue(actual)} to be an array`);
      }
      if (!actual.some((value) => deepEqual(value, item))) {
        throw new Error(`Expected ${formatValue(actual)} to contain equal ${formatValue(item)}`);
      }
    },
    
    /**
     * Assert that the array has the expected length
     * 
     * @param length - The expected length
     */
    toHaveLength(length: number): void {
      if (!('length' in (actual as any))) {
        throw new Error(`Expected ${formatValue(actual)} to have a length property`);
      }
      if ((actual as any).length !== length) {
        throw new Error(`Expected ${formatValue(actual)} to have length ${length}, but got ${(actual as any).length}`);
      }
    },
    
    /**
     * Assert that the object has the expected property
     * 
     * @param path - The property path
     * @param value - The expected value (optional)
     */
    toHaveProperty(path: string, value?: any): void {
      if (typeof actual !== 'object' || actual === null) {
        throw new Error(`Expected ${formatValue(actual)} to be an object`);
      }
      
      const parts = path.split('.');
      let current: any = actual;
      
      for (const part of parts) {
        if (current === undefined || current === null || !(part in current)) {
          throw new Error(`Expected ${formatValue(actual)} to have property ${formatValue(path)}`);
        }
        current = current[part];
      }
      
      if (arguments.length > 1 && !deepEqual(current, value)) {
        throw new Error(`Expected property ${formatValue(path)} to have value ${formatValue(value)}, but got ${formatValue(current)}`);
      }
    },
    
    /**
     * Assert that the object matches the expected partial object
     * 
     * @param partial - The expected partial object
     */
    toMatchObject(partial: object): void {
      if (typeof actual !== 'object' || actual === null) {
        throw new Error(`Expected ${formatValue(actual)} to be an object`);
      }
      
      const check = (obj: any, partial: any): boolean => {
        for (const key in partial) {
          if (!(key in obj)) {
            return false;
          }
          
          if (typeof partial[key] === 'object' && partial[key] !== null) {
            if (typeof obj[key] !== 'object' || obj[key] === null) {
              return false;
            }
            if (!check(obj[key], partial[key])) {
              return false;
            }
          } else if (!deepEqual(obj[key], partial[key])) {
            return false;
          }
        }
        
        return true;
      };
      
      if (!check(actual, partial)) {
        throw new Error(`Expected ${formatValue(actual)} to match object ${formatValue(partial)}`);
      }
    },
    
    /**
     * Assert that the function throws an error
     * 
     * @param error - The expected error (optional)
     */
    toThrow(error?: Error | RegExp | string): void {
      if (typeof actual !== 'function') {
        throw new Error(`Expected ${formatValue(actual)} to be a function`);
      }
      
      try {
        actual();
      } catch (e) {
        if (!error) {
          return;
        }
        
        if (error instanceof RegExp) {
          if (!error.test((e as Error).message)) {
            throw new Error(`Expected function to throw error matching ${formatValue(error)}, but got ${formatValue((e as Error).message)}`);
          }
        } else if (typeof error === 'string') {
          if ((e as Error).message !== error) {
            throw new Error(`Expected function to throw error ${formatValue(error)}, but got ${formatValue((e as Error).message)}`);
          }
        } else if (e !== error) {
          throw new Error(`Expected function to throw ${formatValue(error)}, but got ${formatValue(e)}`);
        }
        
        return;
      }
      
      throw new Error(`Expected function to throw an error`);
    },
    
    /**
     * Create a custom assertion
     * 
     * @param predicate - The predicate function
     * @param message - The error message
     */
    to(predicate: (value: T) => boolean, message: string): void {
      if (!predicate(actual)) {
        throw new Error(message);
      }
    },
    
    /**
     * Create a negated expectation
     */
    get not() {
      const self = this;
      return {
        toBe(expected: T): void {
          try {
            self.toBe(expected);
            throw new Error(`Expected ${formatValue(actual)} not to be ${formatValue(expected)}`);
          } catch (e) {
            if ((e as Error).message.startsWith('Expected ')) {
              return;
            }
            throw e;
          }
        },
        
        // Add negated versions of other assertions...
        // This is just an example, you would need to implement all the negated versions
        
        to(predicate: (value: T) => boolean, message: string): void {
          if (predicate(actual)) {
            throw new Error(message);
          }
        },
      };
    },
    
    /**
     * Create an async expectation
     */
    get resolves() {
      if (!(actual instanceof Promise)) {
        throw new Error(`Expected ${formatValue(actual)} to be a promise`);
      }
      
      return {
        async toBe(expected: any): Promise<void> {
          const result = await actual;
          if (result !== expected) {
            throw new Error(`Expected promise to resolve to ${formatValue(expected)}, but got ${formatValue(result)}`);
          }
        },
        
        // Add other async assertions...
        // This is just an example, you would need to implement all the async versions
      };
    },
    
    /**
     * Create an async rejection expectation
     */
    get rejects() {
      if (!(actual instanceof Promise)) {
        throw new Error(`Expected ${formatValue(actual)} to be a promise`);
      }
      
      return {
        async toThrow(error?: Error | RegExp | string): Promise<void> {
          try {
            await actual;
            throw new Error(`Expected promise to reject, but it resolved`);
          } catch (e) {
            if (e instanceof Error && e.message === 'Expected promise to reject, but it resolved') {
              throw e;
            }
            
            if (!error) {
              return;
            }
            
            if (error instanceof RegExp) {
              if (!error.test((e as Error).message)) {
                throw new Error(`Expected promise to reject with error matching ${formatValue(error)}, but got ${formatValue((e as Error).message)}`);
              }
            } else if (typeof error === 'string') {
              if ((e as Error).message !== error) {
                throw new Error(`Expected promise to reject with error ${formatValue(error)}, but got ${formatValue((e as Error).message)}`);
              }
            } else if (e !== error) {
              throw new Error(`Expected promise to reject with ${formatValue(error)}, but got ${formatValue(e)}`);
            }
          }
        },
        
        // Add other async rejection assertions...
        // This is just an example, you would need to implement all the async rejection versions
      };
    },
  };
}

/**
 * Format a value for display in error messages
 * 
 * @param value - The value to format
 * @returns The formatted value
 */
function formatValue(value: any): string {
  if (value === undefined) {
    return 'undefined';
  }
  
  if (value === null) {
    return 'null';
  }
  
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  
  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return Object.prototype.toString.call(value);
    }
  }
  
  return String(value);
}

/**
 * Check if two values are deeply equal
 * 
 * @param a - The first value
 * @param b - The second value
 * @returns Whether the values are deeply equal
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  
  if (a === null || b === null) {
    return a === b;
  }
  
  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }
    
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }
  
  return true;
}
