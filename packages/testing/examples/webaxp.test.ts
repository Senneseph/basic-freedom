/**
 * Example test file demonstrating WebAXP testing features
 */

import { test, expect } from '../src';
import { createTestApp, createTestBusinessLogic } from '../src/webaxp';

// Test WebAXP application
test('WebAXP application renders correctly', () => {
  const app = createTestApp({
    routes: [
      {
        path: '/',
        components: {
          header: {},
          content: {},
          footer: {},
        },
      },
      {
        path: '/products',
        components: {
          header: {},
          productList: {},
          footer: {},
        },
      },
      {
        path: '/products/:id',
        components: {
          header: {},
          productDetail: {},
          footer: {},
        },
      },
    ],
  });
  
  // Navigate to the home page
  app.navigate('/');
  
  // Check rendered components
  expect(app.getRenderedComponents()).toContain('header');
  expect(app.getRenderedComponents()).toContain('content');
  expect(app.getRenderedComponents()).toContain('footer');
  
  // Navigate to the products page
  app.navigate('/products');
  
  // Check rendered components
  expect(app.getRenderedComponents()).toContain('header');
  expect(app.getRenderedComponents()).toContain('productList');
  expect(app.getRenderedComponents()).toContain('footer');
  
  // Clean up
  app.cleanup();
});

// Test WebAXP business logic controller
test('WebAXP business logic handles user login', () => {
  const blc = createTestBusinessLogic({
    initialState: {
      user: null,
      isLoading: false,
      error: null,
    },
    reducers: {
      'LOGIN_REQUEST': (state: any) => ({
        ...state,
        isLoading: true,
        error: null,
      }),
      'LOGIN_SUCCESS': (state: any, action: any) => ({
        ...state,
        isLoading: false,
        user: action.payload,
      }),
      'LOGIN_FAILURE': (state: any, action: any) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }),
    },
  });
  
  // Initial state
  expect(blc.getState().user).toBeNull();
  expect(blc.getState().isLoading).toBeFalsy();
  expect(blc.getState().error).toBeNull();
  
  // Dispatch login request
  blc.dispatch({
    type: 'LOGIN_REQUEST',
  });
  
  // Check loading state
  expect(blc.getState().isLoading).toBeTruthy();
  
  // Dispatch login success
  blc.dispatch({
    type: 'LOGIN_SUCCESS',
    payload: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  });
  
  // Check logged in state
  expect(blc.getState().isLoading).toBeFalsy();
  expect(blc.getState().user).toEqual({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  });
  
  // Clean up
  blc.cleanup();
});

// Test WebAXP business logic with error handling
test('WebAXP business logic handles login failure', () => {
  const blc = createTestBusinessLogic({
    initialState: {
      user: null,
      isLoading: false,
      error: null,
    },
    reducers: {
      'LOGIN_REQUEST': (state: any) => ({
        ...state,
        isLoading: true,
        error: null,
      }),
      'LOGIN_SUCCESS': (state: any, action: any) => ({
        ...state,
        isLoading: false,
        user: action.payload,
      }),
      'LOGIN_FAILURE': (state: any, action: any) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }),
    },
  });
  
  // Initial state
  expect(blc.getState().user).toBeNull();
  expect(blc.getState().isLoading).toBeFalsy();
  expect(blc.getState().error).toBeNull();
  
  // Dispatch login request
  blc.dispatch({
    type: 'LOGIN_REQUEST',
  });
  
  // Check loading state
  expect(blc.getState().isLoading).toBeTruthy();
  
  // Dispatch login failure
  blc.dispatch({
    type: 'LOGIN_FAILURE',
    payload: 'Invalid credentials',
  });
  
  // Check error state
  expect(blc.getState().isLoading).toBeFalsy();
  expect(blc.getState().user).toBeNull();
  expect(blc.getState().error).toBe('Invalid credentials');
  
  // Clean up
  blc.cleanup();
});
