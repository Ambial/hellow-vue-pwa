<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
    <!-- Top App Navigation -->
    <header class="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Brand Logo -->
        <router-link 
          to="/" 
          class="flex items-center space-x-2.5 group"
          exact
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-base tracking-tight text-gray-900 dark:text-white">Hello PWA</span>
              <span class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 uppercase tracking-wider">v1.1</span>
            </div>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link 
            to="/" 
            class="nav-link" 
            active-class="nav-link-active" 
            exact
          >
            Dashboard
          </router-link>
          <router-link 
            to="/todos" 
            class="nav-link" 
            active-class="nav-link-active"
          >
            Todos
          </router-link>
          <router-link 
            to="/page-1" 
            class="nav-link" 
            active-class="nav-link-active"
          >
            Device Labs
          </router-link>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-2">
          <!-- Live Network Indicator -->
          <div 
            class="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            :class="isOnline ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'"
            :title="isOnline ? 'Connected to internet' : 'Working offline with local cache'"
          >
            <span class="w-2 h-2 rounded-full" :class="isOnline ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'"></span>
            <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
          </div>

          <!-- PWA Install Button -->
          <button 
            v-if="canInstall"
            @click="installApp"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm transition-all duration-150"
            title="Install App to your device"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>Install</span>
          </button>

          <!-- Theme Toggle -->
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content View -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-28 md:pb-12">
      <router-view class="fade-in" />
    </main>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg px-2">
      <div class="flex items-center justify-around h-16">
        <router-link 
          to="/" 
          class="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 dark:text-gray-400 transition-colors"
          active-class="text-blue-600 dark:text-blue-400 font-semibold"
          exact
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs">Home</span>
        </router-link>

        <router-link 
          to="/todos" 
          class="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 dark:text-gray-400 transition-colors"
          active-class="text-blue-600 dark:text-blue-400 font-semibold"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          <span class="text-xs">Todos</span>
        </router-link>

        <router-link 
          to="/page-1" 
          class="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 dark:text-gray-400 transition-colors"
          active-class="text-blue-600 dark:text-blue-400 font-semibold"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span class="text-xs">Device Labs</span>
        </router-link>

        <button 
          v-if="canInstall"
          @click="installApp"
          class="flex flex-col items-center justify-center flex-1 py-1 text-blue-600 dark:text-blue-400 font-semibold"
        >
          <svg class="w-5 h-5 mb-0.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span class="text-xs">Install</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import ThemeToggle from '@/components/ThemeToggle';

export default {
  components: {
    ThemeToggle
  },
  data: () => ({
    canInstall: false,
    isOnline: navigator.onLine
  }),
  mounted() {
    if (window.deferredPrompt) {
      this.canInstall = true;
    }
    window.addEventListener('pwa-installable', () => {
      this.canInstall = true;
    });
    window.addEventListener('pwa-installed', () => {
      this.canInstall = false;
    });
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  },
  methods: {
    async installApp() {
      if (window.showInstallPrompt) {
        const accepted = await window.showInstallPrompt();
        if (accepted) {
          this.canInstall = false;
        }
      }
    }
  }
};
</script>
