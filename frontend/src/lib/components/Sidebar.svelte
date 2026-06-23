<script lang="ts">
	import { page } from '$app/state';

	const menus = [
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: '📊'
		},
		{
			title: 'Mahasiswa',
			path: '/dashboard/mahasiswa',
			icon: '👨‍🎓'
		},
		{
			title: 'Dosen',
			path: '/dashboard/dosen',
			icon: '👨‍🏫'
		},
		{
			title: 'Prodi',
			path: '/dashboard/prodi',
			icon: '🏫'
		},
		{
			title: 'Semester',
			path: '/dashboard/semester',
			icon: '📅'
		},
		{
			title: 'Mata Kuliah',
			path: '/dashboard/mata-kuliah',
			icon: '📚'
		},
		{
			title: 'Kelas',
			path: '/dashboard/kelas',
			icon: '🏛️'
		},
		{
			title: 'KRS',
			path: '/dashboard/krs',
			icon: '📝'
		}
	];
</script>

<div class="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

	<div class="p-6 border-b border-slate-800">

		<h1 class="text-2xl font-bold">
			SIAT
		</h1>

		<p class="text-slate-400 text-sm mt-1">
			Sistem Informasi Akademik
		</p>

	</div>

	<nav class="p-4 flex-1">

		<div class="space-y-2">

			{#each menus as menu}

				<a
					href={menu.path}
					class={`
						flex items-center gap-3
						p-3 rounded-xl
						transition-all duration-200

						${
							page.url.pathname ===
							menu.path
								? 'bg-blue-600 text-white shadow-lg'
								: 'hover:bg-slate-800 text-slate-300'
						}
					`}
				>

					<span>
						{menu.icon}
					</span>

					<span>
						{menu.title}
					</span>

				</a>

			{/each}

		</div>

	</nav>

</div>