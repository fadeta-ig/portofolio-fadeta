import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';

const timeline = {
  from: vi.fn(() => timeline)
};

vi.mock('gsap', () => ({
  default: {
    context: vi.fn((callback) => {
      callback();
      return { revert: vi.fn() };
    }),
    from: vi.fn(),
    timeline: vi.fn(() => timeline),
    quickTo: vi.fn(() => vi.fn())
  }
}));

import HeroSection from '../../src/components/HeroSection.vue';

async function mountHero() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<main />' } },
      { path: '/portfolio', component: { template: '<main />' } },
      { path: '/konsultasi', component: { template: '<main />' } },
      { path: '/hasil/:slug', component: { template: '<main />' } }
    ]
  });

  await router.push('/');
  await router.isReady();

  return mount(HeroSection, {
    attachTo: '#test-mount',
    global: { plugins: [router] }
  });
}

describe('Gandiva Labs hero', () => {
  it('menyampaikan narasi problem-solving tanpa indikator flyer', async () => {
    const wrapper = await mountHero();
    const headline = wrapper.get('h1').text();

    expect(headline).toContain('Partner website');
    expect(headline).toContain('bisnis yang');
    expect(headline).toContain('siap bertumbuh.');
    expect(wrapper.text()).not.toContain('01 / 04');
    expect(wrapper.text()).not.toContain('Website yang masuk akal');
    expect(wrapper.find('.hero-wordmark').exists()).toBe(false);

    const heroImage = wrapper.get('.hero-visual img');
    expect(wrapper.get('.hero-visual').element.tagName).toBe('PICTURE');
    expect(wrapper.get('.hero-visual source').attributes('srcset')).toContain('gandiva-hero-editorial-mobile-v1.webp');
    expect(heroImage.attributes('fetchpriority')).toBe('high');
    expect(heroImage.attributes('loading')).toBe('eager');
    expect(heroImage.attributes('width')).toBe('1672');
    expect(heroImage.attributes('height')).toBe('941');

    wrapper.unmount();
  });

  it('menyediakan empat kanal kontak dan carousel keunggulan', async () => {
    const wrapper = await mountHero();
    const links = wrapper.findAll('.hero-social-link');

    expect(links).toHaveLength(4);
    expect(links.map((link) => link.attributes('href'))).toEqual([
      expect.stringContaining('https://wa.me/'),
      'mailto:fadeta287@gmail.com',
      'https://www.threads.com/@gandivalabs',
      'https://www.instagram.com/gandivalabs'
    ]);
    expect(wrapper.findAll('.hero-brand-icon')).toHaveLength(3);
    expect(wrapper.get('.hero-benefit-card').text()).toContain('Konsultasi awal gratis');

    const navigation = wrapper.findAll('.hero-benefit-navigation button');
    expect(navigation).toHaveLength(2);
    await navigation[1].trigger('click');
    expect(wrapper.get('.hero-benefit-card').text()).toContain('Biaya jelas dan terjangkau');

    wrapper.unmount();
  });
});
