<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50">
	<div class="text-center space-y-4">
		<div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
		<p class="text-slate-500 font-medium">Mengarahkan...</p>
	</div>
</div>