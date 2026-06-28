<script lang="ts">
	import { get } from 'svelte/store';

	import SidebarGroup from './SidebarGroup.svelte';
	import SidebarItem from './SidebarItem.svelte';

	import {
		adminNavigation,
		dosenNavigation,
		mahasiswaNavigation
	} from '$lib/theme/navigation';

	import { user as userStore } from '$lib/stores/auth';

	let {
		collapsed = false
	}: {
		collapsed?: boolean;
	} = $props();

	const currentUser = get(userStore);

	const role = currentUser?.role ?? 'MAHASISWA';

	const navigation =
		role === 'ADMIN'
			? adminNavigation
			: role === 'DOSEN'
				? dosenNavigation
				: mahasiswaNavigation;

	const name = currentUser?.name ?? 'Pengguna';
</script>

<aside
	class={`
		bg-slate-900
		text-white
		h-screen
		flex
		flex-col
		border-r
		border-slate-800
		transition-all
		duration-300
		${collapsed ? 'w-20' : 'w-72'}
	`}
>

	<!-- Logo -->

	<div
		class="
			h-[72px]
			border-b
			border-slate-800
			flex
			items-center
			justify-center
			shrink-0
		"
	>

		{#if collapsed}

			<div
				class="
					w-11
					h-11
					rounded-xl
					bg-blue-600
					flex
					items-center
					justify-center
					font-bold
					text-lg
				"
			>
				S
			</div>

		{:else}

			<div class="flex items-center gap-3">

				<div
					class="
						w-11
						h-11
						bg-blue-600
						rounded-xl
						flex
						items-center
						justify-center
						font-bold
						text-lg
					"
				>
					S
				</div>

				<div>

					<h1 class="font-bold text-lg">

						SIAT

					</h1>

					<p class="text-xs text-slate-400">

						Sistem Informasi Akademik

					</p>

				</div>

			</div>

		{/if}

	</div>

	<!-- Menu -->

	<div
		class="
			flex-1
			overflow-y-auto
			p-4
		"
	>

		{#each navigation as group}

			<SidebarGroup
				title={group.group}
				{collapsed}
			>

				{#each group.items as item}

					<SidebarItem
						title={item.title}
						path={item.path}
						icon={item.icon}
						{collapsed}
					/>

				{/each}

			</SidebarGroup>

		{/each}

	</div>

	<!-- Footer -->

	<div
		class="
			border-t
			border-slate-800
			p-4
			shrink-0
		"
	>

		{#if collapsed}

			<div
				class="
					w-10
					h-10
					bg-slate-700
					rounded-full
					flex
					items-center
					justify-center
					font-semibold
				"
			>

				{name.charAt(0).toUpperCase()}

			</div>

		{:else}

			<div class="flex items-center gap-3">

				<div
					class="
						w-10
						h-10
						bg-blue-600
						rounded-full
						flex
						items-center
						justify-center
						font-semibold
					"
				>

					{name.charAt(0).toUpperCase()}

				</div>

				<div>

					<p class="font-medium text-sm">

						{name}

					</p>

					<p class="text-xs text-slate-400">

						{role}

					</p>

				</div>

			</div>

			<p
				class="
					mt-4
					text-center
					text-xs
					text-slate-500
				"
			>

				SIAT v1.0.0

			</p>

		{/if}

	</div>

</aside>