import { createApp } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './assets/css/main.css';
import App from './App.vue';

/* Register GSAP plugins once at app entry (best practice per gsap-frameworks skill) */
gsap.registerPlugin(ScrollTrigger);

createApp(App).mount('#app');
