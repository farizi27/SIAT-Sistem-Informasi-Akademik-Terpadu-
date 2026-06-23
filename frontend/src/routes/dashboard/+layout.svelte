<script lang="ts">
	import Sidebar
	from '$lib/components/Sidebar.svelte';

	import Navbar
	from '$lib/components/Navbar.svelte';

    let { children } = $props();
</script>

<div class="flex bg-slate-100 min-h-screen">
	<Sidebar />

	<div class="flex-1">
		<Navbar />

		<div class="p-6">
			{@render children()}
		</div>
	</div>
</div>