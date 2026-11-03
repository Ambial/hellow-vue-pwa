const { createFakeIndexedDB } = require('./fakeIndexedDB');

// Set up the fake before importing db.js so its lazy open() sees it.
global.indexedDB = createFakeIndexedDB();
const db = require('../db').default;

beforeEach(async () => {
  await db.clearAll();
});

describe('db (IndexedDB wrapper)', () => {
  test('getAllTodos returns an empty list initially', async () => {
    expect(await db.getAllTodos()).toEqual([]);
  });

  test('addTodo assigns an auto-increment id and persists the record', async () => {
    const id = await db.addTodo({ text: 'Write tests' });
    expect(id).toBe(1);

    const todos = await db.getAllTodos();
    expect(todos).toEqual([{ id: 1, text: 'Write tests' }]);
  });

  test('updateTodo replaces the stored record', async () => {
    const id = await db.addTodo({ text: 'Task' });
    await db.updateTodo({ id, text: 'Task', completed: true });

    expect(await db.getAllTodos()).toEqual([{ id, text: 'Task', completed: true }]);
  });

  test('deleteTodo removes the record by id', async () => {
    const id = await db.addTodo({ text: 'Gone' });
    await db.deleteTodo(id);

    expect(await db.getAllTodos()).toEqual([]);
  });

  test('clearAll empties the store and resets auto-increment ids', async () => {
    await db.addTodo({ text: 'A' });
    await db.clearAll();

    const id = await db.addTodo({ text: 'B' });
    expect(id).toBe(1);
  });

  test('toggleTodo flips the completed flag', async () => {
    const id = await db.addTodo({ text: 'Flip me', completed: false });
    await db.toggleTodo(id);

    expect(await db.getAllTodos()).toEqual([{ id, text: 'Flip me', completed: true }]);
  });

  test('toggleTodo rejects when the todo does not exist', async () => {
    await expect(db.toggleTodo(99)).rejects.toThrow('Todo not found');
  });
});
