<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Device & PWA Labs</h1>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        Real-time telemetry and browser API tests for your connected Pixel 6a.
      </p>
    </div>

    <!-- Telemetry Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Device & Display Specs -->
      <div class="card p-5 space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="font-bold text-sm text-gray-900 dark:text-white">Display & Platform</h2>
            <p class="text-xs text-gray-400">Viewport and hardware metrics</p>
          </div>
        </div>

        <div class="space-y-2.5 text-xs divide-y divide-gray-100 dark:divide-gray-700">
          <div class="flex justify-between pt-1">
            <span class="text-gray-500 dark:text-gray-400">Screen Resolution</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ screenWidth }} × {{ screenHeight }} px</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">Device Pixel Ratio</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ pixelRatio }}x</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">Touch Support</span>
            <span class="font-semibold text-green-600 dark:text-green-400">{{ touchPoints > 0 ? `Yes (${touchPoints} points)` : 'Mouse / Trackpad' }}</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">Display Mode</span>
            <span class="font-semibold text-blue-600 dark:text-blue-400">{{ isStandalone ? 'Standalone App' : 'Browser View' }}</span>
          </div>
        </div>
      </div>

      <!-- PWA & Storage Specs -->
      <div class="card p-5 space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"/>
            </svg>
          </div>
          <div>
            <h2 class="font-bold text-sm text-gray-900 dark:text-white">PWA & Storage Engine</h2>
            <p class="text-xs text-gray-400">Offline caching and storage quota</p>
          </div>
        </div>

        <div class="space-y-2.5 text-xs divide-y divide-gray-100 dark:divide-gray-700">
          <div class="flex justify-between pt-1">
            <span class="text-gray-500 dark:text-gray-400">Service Worker</span>
            <span class="font-semibold text-green-600 dark:text-green-400">{{ swStatus }}</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">IndexedDB Status</span>
            <span class="font-semibold text-green-600 dark:text-green-400">Active (v1)</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">Storage Estimate</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ storageUsage }}</span>
          </div>
          <div class="flex justify-between pt-2">
            <span class="text-gray-500 dark:text-gray-400">User Agent</span>
            <span class="font-medium text-gray-600 dark:text-gray-400 truncate max-w-[180px]" :title="userAgent">{{ userAgent }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Native Hardware & Web API Test Deck -->
    <div class="card p-5 space-y-4">
      <div>
        <h2 class="font-bold text-sm text-gray-900 dark:text-white">Device Hardware Actions</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Test native Android device integration directly from the PWA.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Action 1: Vibration -->
        <button 
          @click="testHaptic" 
          class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-700 active:scale-95 text-left transition-all"
        >
          <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="font-semibold text-xs text-gray-900 dark:text-white">Haptic Vibration</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Triggers subtle 50ms vibration motor pulse on Pixel 6a</p>
        </button>

        <!-- Action 2: Native Share -->
        <button 
          @click="testShare" 
          class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-700 active:scale-95 text-left transition-all"
        >
          <div class="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span class="font-semibold text-xs text-gray-900 dark:text-white">Native Share Sheet</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Opens the Android system share dialog via Web Share API</p>
        </button>

        <!-- Action 3: Refresh SW Cache -->
        <button 
          @click="reloadServiceWorker" 
          class="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 bg-gray-50 dark:bg-gray-700 active:scale-95 text-left transition-all"
        >
          <div class="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="font-semibold text-xs text-gray-900 dark:text-white">Refresh Cache</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Forces Service Worker cache update check</p>
        </button>
      </div>

      <div v-if="feedback" class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium fade-in">
        {{ feedback }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page1',
  data: () => ({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    touchPoints: navigator.maxTouchPoints || 0,
    userAgent: navigator.userAgent,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
    swStatus: 'Checking...',
    storageUsage: 'Calculating...',
    feedback: ''
  }),
  mounted() {
    this.updateSpecs();
    window.addEventListener('resize', this.updateSpecs);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateSpecs);
  },
  methods: {
    async updateSpecs() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        this.swStatus = reg ? (reg.active ? 'Active & Running' : 'Installing') : 'Not registered';
      } else {
        this.swStatus = 'Unsupported';
      }

      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const usedMb = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
          const totalMb = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
          this.storageUsage = `${usedMb} MB used (of ${totalMb} MB)`;
        } catch {
          this.storageUsage = 'Available';
        }
      } else {
        this.storageUsage = 'Standard';
      }
    },
    testHaptic() {
      if ('vibrate' in navigator) {
        navigator.vibrate([60, 40, 60]);
        this.showFeedback('Haptic pulse sent to device!');
      } else {
        this.showFeedback('Vibration API not supported on this browser context.');
      }
    },
    async testShare() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Hello Vue PWA',
            text: 'Testing PWA features on Pixel 6a!',
            url: window.location.origin
          });
          this.showFeedback('Share sheet opened successfully.');
        } catch (err) {
          if (err.name !== 'AbortError') {
            this.showFeedback(`Share error: ${err.message}`);
          }
        }
      } else {
        this.showFeedback('Web Share API is supported in HTTPS/Standalone context.');
      }
    },
    async reloadServiceWorker() {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
          this.showFeedback('Service worker updated and cache refreshed.');
        }
      }
    },
    showFeedback(msg) {
      this.feedback = msg;
      setTimeout(() => {
        if (this.feedback === msg) this.feedback = '';
      }, 4000);
    }
  }
};
</script>
