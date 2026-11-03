import { mount } from '@vue/test-utils';
import ThemeToggle from '../ThemeToggle.vue';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders a button with the correct aria label in light mode', () => {
    const wrapper = mount(ThemeToggle);
    expect(wrapper.html()).toContain('Switch to dark mode');
  });

  test('toggles the dark class on document and persists the choice', async () => {
    const wrapper = mount(ThemeToggle);

    await wrapper.vm.toggleTheme();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    await wrapper.vm.toggleTheme();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('respects a stored theme preference', () => {
    localStorage.setItem('theme', 'dark');
    const wrapper = mount(ThemeToggle);

    expect(wrapper.vm.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('falls back to the system color scheme when no preference is stored', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)'
    }));

    const wrapper = mount(ThemeToggle);
    expect(wrapper.vm.isDark).toBe(true);
  });
});
