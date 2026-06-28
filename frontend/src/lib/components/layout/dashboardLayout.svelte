<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();

	let sidebarCollapsed = $state(false);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="flex h-screen bg-slate-100">

	<!-- Sidebar -->
	<Sidebar
		collapsed={sidebarCollapsed}
	/>

	<!-- Content -->
	<div class="flex flex-1 flex-col overflow-hidden">

		<!-- Navbar -->
		<Navbar
			onToggleSidebar={toggleSidebar}
		/>

		<!-- Main -->
		<main
			class="
				flex-1
				overflow-y-auto
				p-6
			"
		>

			{@render children?.()}

		</main>

	</div>

</div>