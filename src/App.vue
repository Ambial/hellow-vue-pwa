<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <router-link 
              to="/"
              class="flex items-center space-x-2"
              active-class="nav-link-active"
            >
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Hello PWA</span>
            </router-link>
            
            <div class="hidden md:flex items-center space-x-1">
              <router-link 
                to="/"
                class="nav-link"
                active-class="nav-link-active"
                exact
              >
                Home
              </router-link>
              <router-link 
                to="/page-1"
                class="nav-link"
                active-class="nav-link-active"
              >
                Page 1
              </router-link>
              <router-link 
                to="/todos"
                class="nav-link"
                active-class="nav-link-active"
              >
                Todos
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Install App Button -->
            <button 
              v-if="canInstall"
              @click="installApp"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              title="Install App to your device"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Install</span>
            </button>

            <!-- Theme Toggle -->
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <router-view class="fade-in" />
    </main>

    <!-- Mobile Navigation -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="flex justify-around py-2">
        <router-link 
          to="/"
          class="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400"
          active-class="text-blue-600 dark:text-blue-400"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span class="text-xs mt-1">Home</span>
        </router-link>
        <router-link 
          to="/page-1"
          class="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400"
          active-class="text-blue-600 dark:text-blue-400"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
          </svg>
          <span class="text-xs mt-1">Page 1</span>
        </router-link>
        <router-link 
          to="/todos"
          class="flex flex-col items-center py-2 text-gray-500 dark:text-gray-400"
          active-class="text-blue-600 dark:text-blue-400"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs mt-1">Todos</span>
        </router-link>
        <button 
          v-if="canInstall"
          @click="installApp"
          class="flex flex-col items-center py-2 text-blue-600 dark:text-blue-400"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span class="text-xs mt-1">Install</span>
        </button>
      </div>
    </div>
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
    links: [
      {
        name: 'Home',
        to: '/'
      },
      {
        name: 'Page 1',
        to: '/page-1'
      },
      {
        name: 'Todos',
        to: '/todos'
      },
      {
        name: 'Bad Link',
        to: '/random-bad-url'
      }
    ]
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

<style scoped>
/* Custom animations */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
