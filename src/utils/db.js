// IndexedDB wrapper for Todo List
const DB_NAME = 'HelloVuePWADB';
const DB_VERSION = 1;
const STORE_NAME = 'todos';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });

  return dbPromise;
}

export default {
  // Get all todos
  async getAllTodos() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Add a new todo
  async addTodo(todo) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(todo);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Update a todo
  async updateTodo(todo) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(todo);

      request.onsuccess = () => resolve(todo);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Delete a todo
  async deleteTodo(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(id);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Clear all todos
  async clearAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Toggle todo completed status
  async toggleTodo(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const todo = getRequest.result;
        if (todo) {
          todo.completed = !todo.completed;
          const putRequest = store.put(todo);
          putRequest.onsuccess = () => resolve(todo);
          putRequest.onerror = (event) => reject(event.target.error);
        } else {
          reject(new Error('Todo not found'));
        }
      };
      getRequest.onerror = (event) => reject(event.target.error);
    });
  }
};
