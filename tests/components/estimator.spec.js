import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';

// Mock composables and analytics
vi.mock('../../src/composables/useSeo', () => ({
  useSeo: vi.fn()
}));

vi.mock('../../src/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn()
}));

import EstimatorView from '../../src/views/EstimatorView.vue';

async function mountEstimator() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<main />' } },
      { path: '/kalkulator-website', component: EstimatorView },
      { path: '/portfolio', component: { template: '<main />' } }
    ]
  });

  await router.push('/kalkulator-website');
  await router.isReady();

  return mount(EstimatorView, {
    attachTo: '#test-mount',
    global: { plugins: [router] }
  });
}

describe('Smart Website Estimator View', () => {
  it('renders landing screen headline and starts wizard on CTA click', async () => {
    const wrapper = await mountEstimator();
    expect(wrapper.get('h1').text()).toContain('Berapa estimasi');
    expect(wrapper.text()).toContain('Estimasi Biaya Transparan');

    const startButton = wrapper.get('button');
    await startButton.trigger('click');

    expect(wrapper.text()).toContain('Website seperti apa yang Anda butuhkan?');
    expect(wrapper.text()).toContain('Langkah 01 dari 03');

    wrapper.unmount();
  });

  it('navigates through step 1, 2, and 3 to reach recommendation screen', async () => {
    const wrapper = await mountEstimator();

    // Start
    await wrapper.get('button').trigger('click');

    // Step 1: Click Company Profile
    const typeCards = wrapper.findAll('button[role="option"]');
    expect(typeCards.length).toBeGreaterThanOrEqual(4);
    await typeCards[0].trigger('click'); // Company Profile

    // Step 2: Click Kredibilitas
    expect(wrapper.text()).toContain('Apa tujuan utama website Anda?');
    const goalCards = wrapper.findAll('button[role="option"]');
    await goalCards[0].trigger('click');

    // Step 3: Click Professional
    expect(wrapper.text()).toContain('Seberapa lengkap website yang Anda bayangkan?');
    const complexityCards = wrapper.findAll('button[role="option"]');
    await complexityCards[1].trigger('click'); // Professional

    // Should be on recommendation screen
    expect(wrapper.text()).toContain('Company Profile — Tier PROFESSIONAL');
    expect(wrapper.text()).toContain('Rp 2.8 – 4.5 juta');
    expect(wrapper.text()).toContain('Fitur Add-On Opsional');

    wrapper.unmount();
  });

  it('allows selecting paid add-on features and updates estimate preview', async () => {
    const wrapper = await mountEstimator();

    // Fast-forward to recommendation
    await wrapper.get('button').trigger('click');
    const typeCards = wrapper.findAll('button[role="option"]');
    await typeCards[0].trigger('click');
    const goalCards = wrapper.findAll('button[role="option"]');
    await goalCards[0].trigger('click');
    const complexityCards = wrapper.findAll('button[role="option"]');
    await complexityCards[0].trigger('click'); // Starter -> Rp 1.8 - 2.8 jt

    expect(wrapper.text()).toContain('Rp 1.8 – 2.8 juta');

    // Toggle Multilingual add-on (+200k)
    const addonCheckboxes = wrapper.findAll('button[role="checkbox"]');
    expect(addonCheckboxes.length).toBe(4);
    await addonCheckboxes[0].trigger('click'); // Multilingual (+200k)

    // Expected updated price: 1.8M+200k=2.0M, 2.8M+200k=3.0M -> Rp 2 – 3 juta
    expect(wrapper.text()).toContain('Rp 2 – 3 juta');

    wrapper.unmount();
  });

  it('renders final result screen with WhatsApp CTA and copy summary', async () => {
    const wrapper = await mountEstimator();

    // Fast-forward to recommendation
    await wrapper.get('button').trigger('click');
    await wrapper.findAll('button[role="option"]')[0].trigger('click');
    await wrapper.findAll('button[role="option"]')[0].trigger('click');
    await wrapper.findAll('button[role="option"]')[0].trigger('click');

    // Click "Lihat Hasil Akhir Estimasi"
    const resultCta = wrapper.findAll('button').find((b) => b.text().includes('Lihat Hasil Akhir'));
    expect(resultCta).toBeDefined();
    await resultCta.trigger('click');

    // Check result screen elements
    expect(wrapper.text()).toContain('Hasil Estimasi Terhitung');
    expect(wrapper.text()).toContain('Konsultasi via WhatsApp');
    expect(wrapper.text()).toContain('Salin Ringkasan Hasil');
    expect(wrapper.text()).toContain('100% dibantu setup gratis oleh Gandiva Labs');

    wrapper.unmount();
  });
});
