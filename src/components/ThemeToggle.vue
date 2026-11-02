<template>
  <button 
    @click="toggleTheme"
    class="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/80 active:scale-95 transition-all focus:outline-none"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon for dark mode (click to switch to light) -->
    <svg v-if="isDark" class="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Moon icon for light mode (click to switch to dark) -->
    <svg v-else class="w-5 h-5 text-gray-600 transition-transform hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data: () => ({
    isDark: false
  }),
  created() {
    this.isDark = localStorage.getItem('theme') === 'dark' || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                   !localStorage.getItem('theme'));
    this.applyTheme();
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
      this.$emit('theme-changed', this.isDark);
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    }
  }
};
</script>
