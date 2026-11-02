<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Todo List</h1>
          <span 
            class="text-sm px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
          >
            {{ todos.length }} tasks
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            class="btn-icon"
            aria-label="Toggle theme"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.272.272a1 1 0 001.414-1.414l-.272-.272a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.272.272a1 1 0 01-1.414-1.414l.272-.272a1 1 0 011.414 0zM14 11a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zm-4 1a1 1 0 011-1h1a1 1 0 110 2H9a1 1 0 01-1-1zm-2-4a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1 7a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm1-5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </button>
          
          <!-- Clear All Button -->
          <button 
            @click="clearAll"
            :disabled="todos.length === 0"
            class="btn-secondary text-sm px-3 py-1.5"
            :class="{ 'opacity-50 cursor-not-allowed': todos.length === 0 }"
          >
            Clear All
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- Add Todo Form -->
      <div class="card mb-6 fade-in">
        <form @submit.prevent="addTodo" class="flex space-x-2">
          <input 
            v-model="newTodo"
            @keyup.enter="addTodo"
            placeholder="Add a new task..."
            class="input-field flex-1"
            ref="todoInput"
          />
          <button 
            type="submit"
            :disabled="!newTodo.trim()"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': !newTodo.trim() }"
          >
            Add
          </button>
        </form>
      </div>

      <!-- Todo List -->
      <div class="card" v-if="todos.length > 0">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="todo in sortedTodos" 
            :key="todo.id"
            class="todo-item slide-up"
          >
            <div class="flex items-center space-x-3 flex-1">
              <input 
                type="checkbox"
                v-model="todo.completed"
                @change="toggleTodo(todo)"
                :id="`todo-${todo.id}`"
                class="checkbox"
              />
              <label 
                :for="`todo-${todo.id}`"
                class="flex-1 cursor-pointer"
                :class="{
                  'line-through text-gray-400 dark:text-gray-500': todo.completed,
                  'text-gray-900 dark:text-gray-100': !todo.completed
                }"
              >
                {{ todo.text }}
              </label>
            </div>
            <button 
              @click="deleteTodo(todo.id)"
              class="btn-icon text-red-500 hover:text-red-700 dark:hover:text-red-400"
              aria-label="Delete todo"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-else 
        class="card text-center py-12 fade-in"
      >
        <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-lg">No tasks yet</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Add one above to get started</p>
      </div>

      <!-- Stats -->
      <div class="card mt-6" v-if="todos.length > 0">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <span 
              class="flex items-center"
              :class="{
                'text-green-600 dark:text-green-400': completedCount > 0,
                'text-gray-400': completedCount === 0
              }"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              {{ completedCount }} completed
            </span>
            <span 
              class="flex items-center text-gray-500 dark:text-gray-400"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {{ incompleteCount }} remaining
            </span>
          </div>
          <button 
            @click="clearCompleted"
            :disabled="completedCount === 0"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            :class="{ 'opacity-50 cursor-not-allowed': completedCount === 0 }"
          >
            Clear completed
          </button>
        </div>
      </div>
    </main>

    <!-- Offline Status -->
    <div 
      v-if="!isOnline"
      class="fixed bottom-4 left-4 right-4 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-3 rounded-lg shadow-lg flex items-center justify-center space-x-2"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <span>Offline - Changes will sync when back online</span>
    </div>
  </div>
</template>

<script>
import db from '../utils/db';

export default {
  data: () => ({
    newTodo: '',
    todos: [],
    isDark: false,
    isOnline: navigator.onLine
  }),
  computed: {
    sortedTodos() {
      return [...this.todos].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return a.id - b.id;
      });
    },
    completedCount() {
      return this.todos.filter(t => t.completed).length;
    },
    incompleteCount() {
      return this.todos.filter(t => !t.completed).length;
    }
  },
  async created() {
    // Load theme from localStorage
    this.isDark = localStorage.getItem('theme') === 'dark' || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                   !localStorage.getItem('theme'));
    this.applyTheme();
    
    // Load todos from IndexedDB
    await this.loadTodos();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  },
  methods: {
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    },
    async loadTodos() {
      try {
        this.todos = await db.getAllTodos();
      } catch (error) {
        console.error('Failed to load todos:', error);
        this.todos = [];
      }
    },
    async addTodo() {
      if (!this.newTodo.trim()) return;
      
      const todo = {
        text: this.newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      try {
        await db.addTodo(todo);
        this.todos.push(todo);
        this.newTodo = '';
        this.$nextTick(() => this.$refs.todoInput.focus());
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    },
    async toggleTodo(todo) {
      try {
        await db.updateTodo(todo);
      } catch (error) {
        console.error('Failed to update todo:', error);
        // Revert if failed
        todo.completed = !todo.completed;
      }
    },
    async deleteTodo(id) {
      try {
        await db.deleteTodo(id);
        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    },
    async clearAll() {
      if (this.todos.length === 0) return;
      
      if (confirm('Are you sure you want to delete all todos?')) {
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
      if (completed.length === 0) return;
      
      try {
        for (const todo of completed) {
          await db.deleteTodo(todo.id);
        }
        this.todos = this.todos.filter(todo => !todo.completed);
      } catch (error) {
        console.error('Failed to clear completed todos:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
