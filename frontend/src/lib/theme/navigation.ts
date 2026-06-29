// src/lib/theme/navigation.ts
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Calendar,
  BookOpen,
  School,
  ClipboardList,
  FileText,
  User,
  ScrollText
} from '@lucide/svelte';

import type { Component } from 'svelte';

export interface NavigationItem {
  title: string;
  path: string;
  icon: Component;
}

export interface NavigationGroup {
  group: string;
  items: NavigationItem[];
}

/* ===========================
   ADMIN
   =========================== */

export const adminNavigation: NavigationGroup[] = [
  {
    group: 'MAIN',
    items: [{ title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }]
  },
  {
    group: 'MASTER DATA',
    items: [
      { title: 'Mahasiswa', path: '/dashboard/mahasiswa', icon: Users },
      { title: 'Dosen', path: '/dashboard/dosen', icon: GraduationCap },
      { title: 'Program Studi', path: '/dashboard/prodi', icon: Building2 },
      { title: 'Semester', path: '/dashboard/semester', icon: Calendar },
      { title: 'Mata Kuliah', path: '/dashboard/mata-kuliah', icon: BookOpen },
      { title: 'Kelas', path: '/dashboard/kelas', icon: School }
    ]
  },
  {
    group: 'AKADEMIK',
    items: [
      { title: 'KRS', path: '/dashboard/krs', icon: ClipboardList },
      { title: 'Nilai', path: '/dashboard/nilai', icon: FileText },
      { title: 'Transkrip', path: '/dashboard/transkrip', icon: ScrollText }
    ]
  }
];

/* ===========================
   DOSEN
   =========================== */

export const dosenNavigation: NavigationGroup[] = [
  {
    group: 'MENU',
    items: [
      { title: 'Dashboard', path: '/dosen', icon: LayoutDashboard },
      { title: 'Kelas Saya', path: '/dosen/kelas', icon: School },
      { title: 'Profil', path: '/dosen/profile', icon: User },
      { title: 'Aktivitas', path: '/dosen/aktivitas', icon: ClipboardList }
    ]
  }
];

/* ===========================
   MAHASISWA
   =========================== */

export const mahasiswaNavigation: NavigationGroup[] = [
  {
    group: 'MENU',
    items: [
      { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { title: 'KRS', path: '/mahasiswa/krs', icon: ClipboardList },
      { title: 'Transkrip', path: '/mahasiswa/transkrip', icon: ScrollText },
      { title: 'Nilai', path: '/mahasiswa/nilai', icon: FileText },
      { title: 'Jadwal Kuliah', path: '/mahasiswa/jadwal', icon: Calendar },
      { title: 'IPK/IPS', path: '/mahasiswa/ipk', icon: User },
      { title: 'Profil', path: '/mahasiswa/profile', icon: User }
    ]
  }
];