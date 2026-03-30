import { Server, Video, Phone, Shield, HardDrive, Database } from 'lucide-vue-next';

export const infraProjects = [
  {
    id: '01',
    title: 'MikroTik Load Balance',
    description: 'Server jaringan dengan konfigurasi load balance untuk distribusi beban trafik secara merata dan menjaga kestabilan koneksi.',
    icon: Server,
    tags: ['MikroTik', 'Load Balance', 'Routing']
  },
  {
    id: '02',
    title: 'Server CCTV',
    description: 'Sistem pengawasan 32 titik kamera pada Plant I dan 12 titik pada Plant II dengan manajemen rekaman terpusat.',
    icon: Video,
    tags: ['CCTV', '44 Titik', 'Multi-Plant']
  },
  {
    id: '03',
    title: 'Server VoIP',
    description: 'Infrastruktur komunikasi suara berbasis IP untuk kebutuhan telepon internal antar divisi dan antar plant.',
    icon: Phone,
    tags: ['VoIP', 'SIP', 'PBX']
  },
  {
    id: '04',
    title: 'IPSec L2TP VPN',
    description: 'Koneksi VPN site-to-site antara Plant I dan Plant II menggunakan protokol IPSec dan L2TP untuk komunikasi data yang aman.',
    icon: Shield,
    tags: ['IPSec', 'L2TP', 'Site-to-Site']
  },
  {
    id: '05',
    title: 'Server On-Premise',
    description: 'DELL PowerEdge T150 dengan Proxmox sebagai hypervisor, menjalankan VM Ubuntu untuk layanan internal skala industri menengah.',
    icon: HardDrive,
    tags: ['Proxmox', 'DELL PowerEdge', 'Ubuntu']
  },
  {
    id: '06',
    title: 'NAS Synology',
    description: 'Server penyimpanan jaringan Synology untuk backup data terpusat, file sharing, dan kebutuhan arsip perusahaan.',
    icon: Database,
    tags: ['Synology', 'NAS', 'Backup']
  }
];
