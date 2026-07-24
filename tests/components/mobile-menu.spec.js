import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('gsap', () => ({
  default: {
    context: vi.fn(() => ({ revert: vi.fn() }))
  }
}));

vi.mock('../../src/components/LogoMark.vue', () => ({
  default: {
    template: '<span role="img" aria-label="Logo Gandiva Labs" />'
  }
}));

import NavBar from '../../src/components/NavBar.vue';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<main />' } },
      { path: '/portfolio', component: { template: '<main />' } },
      { path: '/konsultasi', component: { template: '<main />' } }
    ]
  });
}

async function mountNav() {
  const router = createTestRouter();
  await router.push('/');
  await router.isReady();
  const wrapper = mount(NavBar, {
    attachTo: '#test-mount',
    global: { plugins: [router] }
  });
  await nextTick();
  return { wrapper, router };
}

describe('mobile navigation dialog', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 390
    });
  });

  it('mengunci background, mengelola fokus, dan menutup dengan Escape', async () => {
    const { wrapper } = await mountNav();
    const trigger = wrapper.get('button[aria-controls="mobile-menu"]');
    trigger.element.focus();

    await trigger.trigger('click');
    await nextTick();

    const dialog = document.getElementById('mobile-menu');
    expect(dialog).not.toBeNull();
    expect(document.getElementById('app').inert).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Tutup menu');

    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    await nextTick();

    expect(document.getElementById('mobile-menu')).toBeNull();
    expect(document.getElementById('app').inert).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('menjaga Tab di dalam dialog dan menutup ketika viewport menjadi desktop', async () => {
    const { wrapper } = await mountNav();
    await wrapper.get('button[aria-controls="mobile-menu"]').trigger('click');
    await nextTick();

    const dialog = document.getElementById('mobile-menu');
    const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled])')];
    focusable[0].focus();
    dialog.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true
    }));
    expect(document.activeElement).toBe(focusable.at(-1));

    focusable.at(-1).focus();
    dialog.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true
    }));
    expect(document.activeElement).toBe(focusable[0]);

    window.innerWidth = 1280;
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    expect(document.getElementById('mobile-menu')).toBeNull();
    wrapper.unmount();
  });
});
