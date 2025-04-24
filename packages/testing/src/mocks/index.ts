/**
 * Mocking module
 * 
 * Provides utilities for creating test doubles (mocks, stubs, spies).
 */

/**
 * Mock function implementation
 */
interface MockImplementation {
  (...args: any[]): any;
}

/**
 * Mock function
 */
interface MockFunction extends Function {
  mockReturnValue: (value: any) => MockFunction;
  mockImplementation: (fn: MockImplementation) => MockFunction;
  mockResolvedValue: (value: any) => MockFunction;
  mockRejectedValue: (error: Error) => MockFunction;
  mockClear: () => MockFunction;
  mockReset: () => MockFunction;
  calls: any[][];
  results: { type: 'return' | 'throw', value: any }[];
  instances: any[];
}

/**
 * Create a mock function
 * 
 * @param implementation - The optional implementation
 * @returns A mock function
 */
export function mock(implementation?: MockImplementation): MockFunction {
  const calls: any[][] = [];
  const results: { type: 'return' | 'throw', value: any }[] = [];
  const instances: any[] = [];
  
  let currentImplementation = implementation || (() => undefined);
  
  const mockFn = function(this: any, ...args: any[]) {
    calls.push(args);
    instances.push(this);
    
    try {
      const result = currentImplementation.apply(this, args);
      results.push({ type: 'return', value: result });
      return result;
    } catch (error) {
      results.push({ type: 'throw', value: error });
      throw error;
    }
  } as MockFunction;
  
  mockFn.mockReturnValue = (value: any) => {
    currentImplementation = () => value;
    return mockFn;
  };
  
  mockFn.mockImplementation = (fn: MockImplementation) => {
    currentImplementation = fn;
    return mockFn;
  };
  
  mockFn.mockResolvedValue = (value: any) => {
    currentImplementation = () => Promise.resolve(value);
    return mockFn;
  };
  
  mockFn.mockRejectedValue = (error: Error) => {
    currentImplementation = () => Promise.reject(error);
    return mockFn;
  };
  
  mockFn.mockClear = () => {
    calls.length = 0;
    results.length = 0;
    instances.length = 0;
    return mockFn;
  };
  
  mockFn.mockReset = () => {
    mockFn.mockClear();
    currentImplementation = () => undefined;
    return mockFn;
  };
  
  Object.defineProperty(mockFn, 'calls', {
    get: () => calls,
  });
  
  Object.defineProperty(mockFn, 'results', {
    get: () => results,
  });
  
  Object.defineProperty(mockFn, 'instances', {
    get: () => instances,
  });
  
  return mockFn;
}

/**
 * Create a spy on an object method
 * 
 * @param obj - The object to spy on
 * @param method - The method to spy on
 * @returns A mock function
 */
export function spy<T extends object, K extends keyof T>(obj: T, method: K): MockFunction {
  const original = obj[method] as Function;
  const mockFn = mock((...args: any[]) => original.apply(obj, args));
  
  obj[method] = mockFn as any;
  
  return mockFn;
}

/**
 * Create a stub object
 * 
 * @param methods - The methods to stub
 * @returns A stub object
 */
export function stub<T extends object>(methods: Record<string, Function>): T {
  const obj = {} as T;
  
  for (const [key, value] of Object.entries(methods)) {
    obj[key as keyof T] = mock(value) as any;
  }
  
  return obj;
}
