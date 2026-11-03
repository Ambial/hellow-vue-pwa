import { mount, flushPromises } from '@vue/test-utils';
import Page1 from '../Page1.vue';

describe('Page1', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'vibrate', { value: jest.fn(), configurable: true });
    Object.defineProperty(navigator, 'share', { value: jest.fn(), configurable: true });
    navigator.share.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the device and PWA telemetry cards', async () => {
    const wrapper = mount(Page1);
    await flushPromises();

    expect(wrapper.html()).toContain('Device & PWA Labs');
    // jsdom has no serviceWorker API, so the component reports it unsupported.
    expect(wrapper.vm.swStatus).toBe('Unsupported');
  });

  test('sends a haptic pulse when the Vibration API is supported', async () => {
    const wrapper = mount(Page1);
    await flushPromises();

    await wrapper.vm.testHaptic();

    expect(navigator.vibrate).toHaveBeenCalledWith([60, 40, 60]);
    expect(wrapper.vm.feedback).toBe('Haptic pulse sent to device!');
  });

  test('opens the share sheet when the Web Share API is supported', async () => {
    const wrapper = mount(Page1);
    await flushPromises();

    await wrapper.vm.testShare();

    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Hello Vue PWA',
      text: 'Testing PWA features on Pixel 6a!',
      url: window.location.origin
    });
    expect(wrapper.vm.feedback).toBe('Share sheet opened successfully.');
  });

  test('ignores aborted share requests without showing an error', async () => {
    const abort = new Error();
    abort.name = 'AbortError';
    navigator.share.mockRejectedValue(abort);

    const wrapper = mount(Page1);
    await flushPromises();

    await wrapper.vm.testShare();

    expect(wrapper.vm.feedback).toBe('');
  });
});
