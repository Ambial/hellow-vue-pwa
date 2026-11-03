import { createApp } from '@vue/test-utils';
import App from '../App.vue';
import router from './router';

describe('App shell & routing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createApp(App, { router });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test('renders the app header and desktop navigation', async () => {
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain('Hello PWA');
    expect(wrapper.findAll('.nav-link').length).toBe(3);
  });

  test('navigates to the todo list route', async () => {
    router.push('/todos');
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain('Offline Tasks');
  });

  test('navigates to the device labs route', async () => {
    router.push('/page-1');
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain('Device & PWA Labs');
  });

  test('renders the fallback page for unknown routes', async () => {
    router.push('/does-not-exist');
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain('Page Not Found');
  });
});
