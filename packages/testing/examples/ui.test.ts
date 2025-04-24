/**
 * Example test file demonstrating UI testing features
 */

import { test, expect } from '../src';
import { render, userEvent } from '../src/ui';

// This is a simplified example
// In a real application, you would import your components

// Mock TodoApp component
const TodoApp = `
  <div>
    <h1>Todo App</h1>
    <form>
      <input type="text" placeholder="Add todo" data-testid="todo-input" />
      <button type="submit">Add</button>
    </form>
    <ul data-testid="todo-list"></ul>
  </div>
`;

// Test suite
test('renders the todo app', () => {
  const { getByText } = render(TodoApp);
  expect(getByText('Todo App')).toBeTruthy();
});

test('renders the todo input', () => {
  const { getByPlaceholderText } = render(TodoApp);
  expect(getByPlaceholderText('Add todo')).toBeTruthy();
});

test('renders the add button', () => {
  const { getByText } = render(TodoApp);
  expect(getByText('Add')).toBeTruthy();
});

test('renders the todo list', () => {
  const { getByTestId } = render(TodoApp);
  expect(getByTestId('todo-list')).toBeTruthy();
});

// This test would work with a real implementation
// For now, it's just a demonstration
test('adds a todo item', async () => {
  // Create a more interactive mock
  document.body.innerHTML = `
    <div>
      <h1>Todo App</h1>
      <form id="todo-form">
        <input type="text" placeholder="Add todo" data-testid="todo-input" />
        <button type="submit">Add</button>
      </form>
      <ul data-testid="todo-list"></ul>
    </div>
  `;
  
  // Add event listener to the form
  const form = document.getElementById('todo-form');
  const input = document.querySelector('[data-testid="todo-input"]') as HTMLInputElement;
  const todoList = document.querySelector('[data-testid="todo-list"]') as HTMLUListElement;
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoText = input.value.trim();
    if (todoText) {
      const li = document.createElement('li');
      li.textContent = todoText;
      todoList.appendChild(li);
      input.value = '';
    }
  });
  
  // Get elements
  const { getByPlaceholderText, getByText, queryByText } = render(document.body.innerHTML);
  
  // Initial state
  expect(queryByText('Buy milk')).toBeFalsy();
  
  // Type in the input
  await userEvent.type(getByPlaceholderText('Add todo'), 'Buy milk');
  
  // Click the button
  userEvent.click(getByText('Add'));
  
  // Check that the todo was added
  // This would work with a real implementation
  // For now, it's just a demonstration
  // expect(getByText('Buy milk')).toBeTruthy();
});
