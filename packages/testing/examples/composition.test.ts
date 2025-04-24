/**
 * Example test file demonstrating composition features
 */

import { test, expect, compose, fixture } from '../src';

// User class to test
class User {
  id: string;
  name: string;
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

// Database class to test
class Database {
  private users: User[] = [];

  async addUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async clear(): Promise<void> {
    this.users = [];
  }
}

// Create test fixtures
const withUser = fixture(() => {
  const user = new User('1', 'John Doe', 'john@example.com');
  return { user };
});

const withDatabase = fixture(
  () => {
    const db = new Database();
    return { db };
  },
  async ({ db }) => {
    await db.clear();
  }
);

const withPopulatedDatabase = fixture(
  async () => {
    const db = new Database();
    const users = [
      new User('1', 'John Doe', 'john@example.com'),
      new User('2', 'Jane Smith', 'jane@example.com'),
      new User('3', 'Bob Johnson', 'bob@example.com'),
    ];
    
    for (const user of users) {
      await db.addUser(user);
    }
    
    return { db, users };
  },
  async ({ db }) => {
    await db.clear();
  }
);

// Test with a single fixture
test('user has correct properties', withUser(({ user }) => {
  expect(user.id).toBe('1');
  expect(user.name).toBe('John Doe');
  expect(user.email).toBe('john@example.com');
}));

// Test with composed fixtures
test(
  'can add a user to the database',
  compose(withUser, withDatabase)(async ({ user }, { db }) => {
    await db.addUser(user);
    const retrievedUser = await db.getUser(user.id);
    expect(retrievedUser).toEqual(user);
  })
);

// Test with a more complex fixture
test('can retrieve all users', withPopulatedDatabase(async ({ db, users }) => {
  const allUsers = await db.getAllUsers();
  expect(allUsers.length).toBe(3);
  expect(allUsers).toEqual(users);
}));

// Compose multiple fixtures
const withUserAndDatabase = compose(withUser, withDatabase);

test('can add and retrieve a user', withUserAndDatabase(async ({ user }, { db }) => {
  await db.addUser(user);
  const retrievedUser = await db.getUser(user.id);
  expect(retrievedUser).toEqual(user);
}));
