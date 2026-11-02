<template>
  <button 
    @click="toggleTheme"
    class="btn-icon"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.272.272a1 1 0 001.414-1.414l-.272-.272a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.272.272a1 1 0 01-1.414-1.414l.272-.272a1 1 0 011.414 0zM14 11a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zm-4 1a1 1 0 011-1h1a1 1 0 110 2H9a1 1 0 01-1-1zm-2-4a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1 7a1 1 0 100-2 1 1 0 000 2zm-3-1a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm1-5a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  </button>
</template>

<script>
export default {
  data: () => ({
    isDark: false
  }),
  created() {
    // Load theme from localStorage
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
      // Emit event so other components can react
      this.$emit('theme-changed', this.isDark);
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    }
  }
};
</script>
