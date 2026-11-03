import { mount, flushPromises } from '@vue/test-utils';
import Home from '../Home.vue';

describe('Home', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the hero banner and status cards', async () => {
    const wrapper = mount(Home);
    await flushPromises();

    expect(wrapper.html()).toContain('Supercharged Mobile PWA on Vue.js');
    expect(wrapper.findAll('.card').length).toBeGreaterThanOrEqual(4);
  });

  test('shows offline status by default and reacts to online events', async () => {
    const wrapper = mount(Home);
    await flushPromises();

    // jsdom reports navigator.onLine as false, so the app starts "Offline".
    expect(wrapper.vm.isOnline).toBe(false);
    expect(wrapper.html()).toContain('Offline');

    window.dispatchEvent(new Event('online'));
    await flushPromises();

    expect(wrapper.vm.isOnline).toBe(true);
  });

  test('reports standalone display mode when the media query matches', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(display-mode: standalone)'
    }));

    const wrapper = mount(Home);
    expect(wrapper.vm.isStandalone).toBe(true);
  });
});
