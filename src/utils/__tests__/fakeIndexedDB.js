// Minimal in-memory IndexedDB implementation for unit tests.
// Supports only the subset of APIs used by src/utils/db.js.

function createFakeIndexedDB() {
  const databases = new Map();

  function makeRequest(result) {
    return { result, onsuccess: null, onerror: null };
  }

  function dispatch(request) {
    Promise.resolve().then(() => {
      if (request.onsuccess) {
        request.onsuccess({ target: { result: request.result } });
      }
    });
  }

  function createObjectStore(db, name, options = {}) {
    const items = [];
    let nextId = 1;

    const store = {
      getAll() {
        return dispatch(makeRequest(items.slice()));
      },
      add(record) {
        if (options.autoIncrement && record.id == null) {
          record.id = nextId++;
        } else if (record.id != null) {
          nextId = Math.max(nextId, record.id + 1);
        }
        items.push(record);
        return dispatch(makeRequest(record.id));
      },
      put(record) {
        const index = items.findIndex((item) => item.id === record.id);
        if (index >= 0) {
          items[index] = record;
        } else {
          items.push(record);
        }
        return dispatch(makeRequest(record));
      },
      get(id) {
        return dispatch(makeRequest(items.find((item) => item.id === id)));
      },
      delete(id) {
        const index = items.findIndex((item) => item.id === id);
        if (index >= 0) {
          items.splice(index, 1);
        }
        return dispatch(makeRequest(id));
      },
      clear() {
        items.length = 0;
        nextId = 1;
        return dispatch(makeRequest(undefined));
      }
    };

    db.stores.set(name, store);
    db.objectStoreNames.add(name);
    return store;
  }

  function open(name) {
    let db = databases.get(name);
    const isNew = !db;
    if (isNew) {
      db = { objectStoreNames: new Set(), stores: new Map() };
      databases.set(name, db);
    }

    const request = makeRequest(db);
    Promise.resolve().then(() => {
      if (isNew && request.onupgradeneeded) {
        request.onupgradeneeded({ target: { result: db } });
      }
      if (request.onsuccess) {
        request.onsuccess({ target: { result: db } });
      }
    });

    return request;
  }

  function transaction(db, storeName) {
    return { objectStore: () => db.stores.get(storeName) };
  }

  return { open, transaction };
}

module.exports = { createFakeIndexedDB };
