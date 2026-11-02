<template>
  <div class="space-y-6">
    <!-- Hero Banner Card -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900 p-6 md:p-8 text-white shadow-xl">
      <div class="relative z-10 max-w-xl space-y-4">
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-md text-xs font-bold text-white tracking-wide">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>Offline-First Progressive Web App</span>
        </div>

        <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Supercharged Mobile PWA on Vue.js
        </h1>

        <p class="text-white text-opacity-90 text-sm md:text-base leading-relaxed font-normal">
          Installable directly to your Pixel 6a home screen with background Service Worker caching, offline IndexedDB persistence, and dark mode.
        </p>

        <div class="pt-2 flex flex-wrap gap-3">
          <router-link 
            to="/todos" 
            class="inline-flex items-center space-x-2 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all"
          >
            <span>Open Todo List</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </router-link>

          <router-link 
            to="/page-1" 
            class="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 active:scale-95 text-white px-4 py-2.5 rounded-xl font-semibold text-sm border border-white border-opacity-30 transition-all"
          >
            <span>Device Diagnostics</span>
          </router-link>
        </div>
      </div>

      <!-- Decorative SVG in background -->
      <div class="absolute right-2 top-2 opacity-15 pointer-events-none">
        <svg class="w-48 h-48 text-white" viewBox="0 0 256 221" fill="currentColor">
          <path d="M0,0 L128,220.8 L256,0 L204.8,0 L128,132.48 L50.56,0 Z" />
        </svg>
      </div>
    </div>

    <!-- Live System Status Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- Status: Network -->
      <div class="card p-4 flex flex-col justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-300 font-medium">Connectivity</span>
        <div class="mt-2 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full" :class="isOnline ? 'bg-green-500' : 'bg-yellow-500'"></span>
          <span class="font-bold text-sm text-gray-900 dark:text-white">{{ isOnline ? 'Online' : 'Offline' }}</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ isOnline ? 'Network synced' : 'Cached local mode' }}</span>
      </div>

      <!-- Status: Service Worker -->
      <div class="card p-4 flex flex-col justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-300 font-medium">Service Worker</span>
        <div class="mt-2 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full" :class="swActive ? 'bg-green-500' : 'bg-blue-500'"></span>
          <span class="font-bold text-sm text-gray-900 dark:text-white">{{ swActive ? 'Active' : 'Installed' }}</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">v1.2 Cache</span>
      </div>

      <!-- Status: Storage -->
      <div class="card p-4 flex flex-col justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-300 font-medium">Database</span>
        <div class="mt-2 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span class="font-bold text-sm text-gray-900 dark:text-white">IndexedDB</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">Persistent offline</span>
      </div>

      <!-- Status: Display Mode -->
      <div class="card p-4 flex flex-col justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-300 font-medium">Display Mode</span>
        <div class="mt-2 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span class="font-bold text-sm text-gray-900 dark:text-white">{{ isStandalone ? 'App Window' : 'Browser Tab' }}</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ isStandalone ? 'Standalone PWA' : 'Can be installed' }}</span>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Card: Todos Shortcut -->
      <div class="card p-5 space-y-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </div>
        <h2 class="font-bold text-base text-gray-900 dark:text-white">Offline Todo Manager</h2>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Create, check off, and manage your tasks without an internet connection. Every task is stored locally inside your phone's IndexedDB.
        </p>
        <router-link 
          to="/todos" 
          class="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
        >
          <span>Manage tasks</span>
          <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>

      <!-- Card: PWA Device Labs -->
      <div class="card p-5 space-y-3">
        <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </div>
        <h2 class="font-bold text-base text-gray-900 dark:text-white">Device Diagnostics & APIs</h2>
        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Inspect device screen dimensions, Pixel 6a touch capabilities, service worker cache storage, and real-time hardware status.
        </p>
        <router-link 
          to="/page-1" 
          class="inline-flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-1"
        >
          <span>View diagnostics</span>
          <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    isOnline: navigator.onLine,
    swActive: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  }),
  mounted() {
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        this.swActive = true;
      });
    }
  }
};
</script>
