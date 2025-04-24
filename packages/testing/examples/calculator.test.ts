/**
 * Example test file for the Calculator class
 */

import { test, describe, expect, beforeEach } from '../src';

// Calculator class to test
class Calculator {
  private value: number = 0;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }

  getCurrentValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  addToValue(value: number): void {
    this.value += value;
  }
}

// Test suite
describe('Calculator', () => {
  let calculator: Calculator;

  // Run before each test
  beforeEach(() => {
    calculator = new Calculator();
  });

  // Test cases
  test('adds two numbers', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  test('subtracts two numbers', () => {
    const result = calculator.subtract(5, 3);
    expect(result).toBe(2);
  });

  test('multiplies two numbers', () => {
    const result = calculator.multiply(2, 3);
    expect(result).toBe(6);
  });

  test('divides two numbers', () => {
    const result = calculator.divide(6, 3);
    expect(result).toBe(2);
  });

  test('throws an error when dividing by zero', () => {
    expect(() => calculator.divide(6, 0)).toThrow('Division by zero');
  });

  test('gets the current value', () => {
    expect(calculator.getCurrentValue()).toBe(0);
  });

  test('sets the value', () => {
    calculator.setValue(10);
    expect(calculator.getCurrentValue()).toBe(10);
  });

  test('adds to the value', () => {
    calculator.setValue(5);
    calculator.addToValue(3);
    expect(calculator.getCurrentValue()).toBe(8);
  });
});

// Nested test suite
describe('Calculator with initial value', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator(10);
  });

  test('gets the initial value', () => {
    expect(calculator.getCurrentValue()).toBe(10);
  });

  test('adds to the initial value', () => {
    calculator.addToValue(5);
    expect(calculator.getCurrentValue()).toBe(15);
  });
});
