<script lang="ts">
	import { page } from '$app/state';
	import { Menu, Bell, LogOut } from '@lucide/svelte';
	import { get } from 'svelte/store';

	import { user as userStore } from '$lib/stores/auth';
	let {
		onToggleSidebar = () => {}
	}: {
		onToggleSidebar?: () => void;
	} = $props();
	const currentUser = get(userStore);

	const user = {
		name: currentUser?.name ?? 'Pengguna',
		role: currentUser?.role ?? 'USER'
	};

	const pageTitle = $derived.by(() => {
		const path = page.url.pathname;

		if (path === '/dashboard') return 'Dashboard';
		if (path.includes('/mahasiswa')) return 'Mahasiswa';
		if (path.includes('/dosen')) return 'Dosen';
		if (path.includes('/prodi')) return 'Program Studi';
		if (path.includes('/semester')) return 'Semester';
		if (path.includes('/mata-kuliah')) return 'Mata Kuliah';
		if (path.includes('/kelas')) return 'Kelas';
		if (path.includes('/krs')) return 'KRS';
		if (path.includes('/nilai')) return 'Nilai';
		if (path.includes('/transkrip')) return 'Transkrip';

		return 'Dashboard';
	});

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		window.location.href = '/login';
	}
</script>

<header
	class="
		h-[72px]
		bg-white
		border-b
		border-slate-200
		px-6
		flex
		items-center
		justify-between
		sticky
		top-0
		z-30
	"
>

	<div class="flex items-center gap-4">

		<button
			type="button"
			onclick={onToggleSidebar}
			class="
				w-10
				h-10
				rounded-xl
				flex
				items-center
				justify-center
				hover:bg-slate-100
				transition
			"
		>

			<Menu size={22}></Menu>

		</button>

		<div>

			<h1 class="text-xl font-bold text-slate-800">

				{pageTitle}

			</h1>

			<p class="text-sm text-slate-500">

				Sistem Informasi Akademik Terpadu

			</p>

		</div>

	</div>

	<div class="flex items-center gap-4">

		<button
			type="button"
			class="
				w-10
				h-10
				rounded-xl
				bg-slate-100
				hover:bg-slate-200
				flex
				items-center
				justify-center
				transition
			"
		>

			<Bell size={20}></Bell>

		</button>

		<div
			class="
				flex
				items-center
				gap-3
				pl-4
				border-l
				border-slate-200
			"
		>

			<div
				class="
					w-11
					h-11
					rounded-full
					bg-blue-600
					text-white
					font-semibold
					flex
					items-center
					justify-center
					shadow
				"
			>

				{user.name.charAt(0).toUpperCase()}

			</div>

			<div>

				<p class="font-semibold text-slate-800">

					{user.name}

				</p>

				<p class="text-xs text-slate-500">

					{user.role}

				</p>

			</div>

		</div>

		<button
			type="button"
			onclick={logout}
			class="
				w-10
				h-10
				rounded-xl
				bg-red-50
				text-red-600
				hover:bg-red-100
				flex
				items-center
				justify-center
				transition
			"
		>

			<LogOut size={18}></LogOut>

		</button>

	</div>

</header>