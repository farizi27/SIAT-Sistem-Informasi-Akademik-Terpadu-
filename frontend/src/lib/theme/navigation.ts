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
		items: [
			{
				title: 'Dashboard',
				path: '/dashboard',
				icon: LayoutDashboard
			}
		]
	},
	{
		group: 'MASTER DATA',
		items: [
			{
				title: 'Mahasiswa',
				path: '/dashboard/mahasiswa',
				icon: Users
			},
			{
				title: 'Dosen',
				path: '/dashboard/dosen',
				icon: GraduationCap
			},
			{
				title: 'Program Studi',
				path: '/dashboard/prodi',
				icon: Building2
			},
			{
				title: 'Semester',
				path: '/dashboard/semester',
				icon: Calendar
			},
			{
				title: 'Mata Kuliah',
				path: '/dashboard/mata-kuliah',
				icon: BookOpen
			},
			{
				title: 'Kelas',
				path: '/dashboard/kelas',
				icon: School
			}
		]
	},
	{
		group: 'AKADEMIK',
		items: [
			{
				title: 'KRS',
				path: '/dashboard/krs',
				icon: ClipboardList
			},
			{
				title: 'Nilai',
				path: '/dashboard/nilai',
				icon: FileText
			},
			{
				title: 'Transkrip',
				path: '/dashboard/transkrip',
				icon: ScrollText
			}
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
			{
				title: 'Dashboard',
				path: '/dashboard',
				icon: LayoutDashboard
			},
			{
				title: 'Kelas Saya',
				path: '/dashboard/kelas',
				icon: School
			},
			{
				title: 'Input Nilai',
				path: '/dashboard/nilai',
				icon: FileText
			},
			{
				title: 'Profil',
				path: '/dashboard/profile',
				icon: User
			}
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
			{
				title: 'Dashboard',
				path: '/dashboard',
				icon: LayoutDashboard
			},
			{
				title: 'KRS',
				path: '/dashboard/krs',
				icon: ClipboardList
			},
			{
				title: 'Transkrip',
				path: '/dashboard/transkrip',
				icon: ScrollText
			},
			{
				title: 'Profil',
				path: '/dashboard/profile',
				icon: User
			}
		]
	}
];