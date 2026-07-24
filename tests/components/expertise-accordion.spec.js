import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/composables/useGsapScrollReveal', () => ({
  useGsapScrollReveal: vi.fn()
}));

import ExpertiseSection from '../../src/components/ExpertiseSection.vue';

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>'
};

function mountAccordion() {
  return mount(ExpertiseSection, {
    attachTo: '#test-mount',
    global: {
      stubs: { RouterLink: RouterLinkStub }
    }
  });
}

describe('service accordion keyboard behavior', () => {
  it('menyinkronkan aria, inert, dan tab order ketika item dipilih', async () => {
    const wrapper = mountAccordion();
    const triggers = wrapper.findAll('button[aria-controls]');

    expect(triggers).toHaveLength(4);
    expect(triggers[0].attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('#service-panel-company-profile').attributes('aria-hidden')).toBe('false');

    await triggers[2].trigger('click');

    expect(triggers[0].attributes('aria-expanded')).toBe('false');
    expect(triggers[2].attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('#service-panel-company-profile').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('#service-panel-toko-online').attributes('aria-hidden')).toBe('false');
    expect(wrapper.get('#service-panel-company-profile a').attributes('tabindex')).toBe('-1');
    expect(wrapper.get('#service-panel-toko-online a').attributes('tabindex')).toBeUndefined();
    wrapper.unmount();
  });

  it('mendukung arrow wrapping, Home, End, serta memindahkan fokus', async () => {
    const wrapper = mountAccordion();
    const triggers = wrapper.findAll('button[aria-controls]');

    await triggers[0].trigger('keydown', { key: 'ArrowUp' });
    await nextTick();
    expect(triggers[3].attributes('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(triggers[3].element);

    await triggers[3].trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    expect(triggers[0].attributes('aria-expanded')).toBe('true');

    await triggers[0].trigger('keydown', { key: 'End' });
    await nextTick();
    expect(triggers[3].attributes('aria-expanded')).toBe('true');

    await triggers[3].trigger('keydown', { key: 'Home' });
    await nextTick();
    expect(triggers[0].attributes('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(triggers[0].element);
    wrapper.unmount();
  });
});
