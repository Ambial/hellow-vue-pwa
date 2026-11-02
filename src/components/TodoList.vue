<template>
  <div class="space-y-6">
    <!-- Page Header & Action Bar -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <div class="flex items-center space-x-2.5">
          <h1 class="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Offline Tasks</h1>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
            {{ todos.length }} {{ todos.length === 1 ? 'task' : 'tasks' }}
          </span>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 mt-0.5 font-normal">
          Persisted offline in IndexedDB on your device.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center space-x-2">
        <button 
          v-if="completedCount > 0"
          @click="clearCompleted"
          class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 active:scale-95 transition-all"
        >
          Clear {{ completedCount }} done
        </button>
        <button 
          v-if="todos.length > 0"
          @click="clearAll"
          class="btn-danger text-xs font-semibold px-3 py-1.5"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Add Task Card Form -->
    <div class="card p-3 md:p-4 shadow-sm bg-white dark:bg-gray-800">
      <form @submit.prevent="addTodo" class="flex items-center space-x-2">
        <div class="relative flex-1">
          <input 
            v-model="newTodo"
            @keyup.enter="addTodo"
            type="text"
            placeholder="Add a new task..."
            class="input-field bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600"
            ref="todoInput"
          />
        </div>
        <button 
          type="submit"
          :disabled="!newTodo.trim()"
          class="btn-primary flex items-center space-x-1"
          :class="{ 'opacity-50 cursor-not-allowed': !newTodo.trim() }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline font-bold">Add</span>
        </button>
      </form>
    </div>

    <!-- Filter Tabs (if tasks exist) -->
    <div v-if="todos.length > 0" class="flex items-center justify-between">
      <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button 
          v-for="filter in ['all', 'active', 'completed']" 
          :key="filter"
          @click="currentFilter = filter"
          class="px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all"
          :class="currentFilter === filter ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
        >
          {{ filter }}
        </button>
      </div>

      <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {{ incompleteCount }} remaining
      </div>
    </div>

    <!-- Todo List Card -->
    <div class="card overflow-hidden bg-white dark:bg-gray-800" v-if="filteredTodos.length > 0">
      <ul class="divide-y divide-gray-100 dark:divide-gray-700">
        <li 
          v-for="todo in filteredTodos" 
          :key="todo.id"
          class="p-4 flex items-center justify-between space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group slide-up"
        >
          <div class="flex items-center space-x-3.5 flex-1 min-w-0">
            <!-- Custom Styled Checkbox -->
            <button 
              type="button"
              @click="toggleTodo(todo)"
              class="w-5 h-5 rounded-lg border flex items-center justify-center transition-all focus:outline-none"
              :class="todo.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-500 hover:border-blue-500 bg-white dark:bg-gray-700'"
              aria-label="Toggle todo status"
            >
              <svg v-if="todo.completed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </button>

            <!-- Task Label -->
            <span 
              @click="toggleTodo(todo)"
              class="text-sm cursor-pointer select-none truncate transition-all"
              :class="todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white font-medium'"
            >
              {{ todo.text }}
            </span>
          </div>

          <!-- Delete Button -->
          <button 
            @click="deleteTodo(todo.id)"
            class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 active:scale-95 transition-all"
            aria-label="Delete todo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="todos.length === 0" 
      class="card text-center py-12 px-4 space-y-3 fade-in bg-white dark:bg-gray-800"
    >
      <div class="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      </div>
      <h3 class="font-bold text-base text-gray-900 dark:text-white">No tasks on your list</h3>
      <p class="text-xs text-gray-500 dark:text-gray-300 max-w-xs mx-auto font-normal">
        Add a task above. It will be saved instantly to your local device database.
      </p>
    </div>

    <!-- Empty Filtered State -->
    <div 
      v-else 
      class="card text-center py-8 px-4 text-xs text-gray-400 fade-in bg-white dark:bg-gray-800"
    >
      No {{ currentFilter }} tasks found.
    </div>

    <!-- Offline Notification Banner -->
    <div 
      v-if="!isOnline"
      class="rounded-2xl bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 p-3.5 flex items-center space-x-3 text-xs text-yellow-800 dark:text-yellow-200 fade-in shadow-sm"
    >
      <div class="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></div>
      <span class="font-medium">You are offline. All changes are stored locally in IndexedDB and ready to use.</span>
    </div>
  </div>
</template>

<script>
import db from '../utils/db';

export default {
  name: 'TodoList',
  data: () => ({
    newTodo: '',
    todos: [],
    currentFilter: 'all',
    isOnline: navigator.onLine
  }),
  computed: {
    filteredTodos() {
      if (this.currentFilter === 'active') {
        return this.todos.filter(t => !t.completed);
      }
      if (this.currentFilter === 'completed') {
        return this.todos.filter(t => t.completed);
      }
      return this.todos;
    },
    completedCount() {
      return this.todos.filter(t => t.completed).length;
    },
    incompleteCount() {
      return this.todos.filter(t => !t.completed).length;
    }
  },
  async created() {
    await this.loadTodos();
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  },
  methods: {
    async loadTodos() {
      try {
        this.todos = await db.getAllTodos();
      } catch (error) {
        console.error('Failed to load todos from IndexedDB:', error);
      }
    },
    async addTodo() {
      const text = this.newTodo.trim();
      if (!text) return;

      const todo = {
        text,
        completed: false,
        createdAt: new Date()
      };

      try {
        const id = await db.addTodo(todo);
        this.todos.unshift({ ...todo, id });
        this.newTodo = '';
        if (this.$refs.todoInput) {
          this.$refs.todoInput.focus();
        }
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    },
    async toggleTodo(todo) {
      todo.completed = !todo.completed;
      try {
        await db.updateTodo(todo);
      } catch (error) {
        console.error('Failed to update todo:', error);
        todo.completed = !todo.completed; // rollback
      }
    },
    async deleteTodo(id) {
      try {
        await db.deleteTodo(id);
        this.todos = this.todos.filter(t => t.id !== id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    },
    async clearAll() {
      if (this.todos.length === 0) return;
      if (confirm('Are you sure you want to delete all tasks?')) {
        try {
          await db.clearAll();
          this.todos = [];
        } catch (error) {
          console.error('Failed to clear todos:', error);
        }
      }
    },
    async clearCompleted() {
      const completed = this.todos.filter(t => t.completed);
      try {
        for (const todo of completed) {
          await db.deleteTodo(todo.id);
        }
        this.todos = this.todos.filter(t => !t.completed);
      } catch (error) {
        console.error('Failed to clear completed todos:', error);
      }
    }
  }
};
</script>
