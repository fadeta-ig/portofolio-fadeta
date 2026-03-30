import {
  siLinux, siMikrotik,
  siVuedotjs, siReact,
  siTailwindcss, siWordpress, siGreensock, siLaravel
} from 'simple-icons';
import { Server, Video } from 'lucide-vue-next';

export const skills = {
  infrastructure: [
    { name: 'Network Architecture', level: 95, iconConfig: { type: 'lucide', icon: Server } },
    { name: 'Linux Server Admin', level: 90, iconConfig: { type: 'simple', path: siLinux.path } },
    { name: 'Mikrotik & Ruijie', level: 95, iconConfig: { type: 'simple', path: siMikrotik.path } },
    { name: 'CCTV & VoIP Systems', level: 90, iconConfig: { type: 'lucide', icon: Video } },
    { name: 'Security & Firewalls', level: 85, iconConfig: { type: 'lucide', icon: Server } },
  ],
  development: [
    { name: 'Vue.js / Nuxt 3', level: 90, iconConfig: { type: 'simple', path: siVuedotjs.path } },
    { name: 'React / Next.js', level: 85, iconConfig: { type: 'simple', path: siReact.path } },
    { name: 'Laravel', level: 85, iconConfig: { type: 'simple', path: siLaravel.path } },
    { name: 'Tailwind CSS', level: 95, iconConfig: { type: 'simple', path: siTailwindcss.path } },
    { name: 'WordPress Development', level: 90, iconConfig: { type: 'simple', path: siWordpress.path } },
    { name: 'GSAP / Three.js', level: 75, iconConfig: { type: 'simple', path: siGreensock.path } },
  ]
};
