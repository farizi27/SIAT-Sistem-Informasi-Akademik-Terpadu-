<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { Component } from 'svelte';

	let {
		title,
		path,
		icon:Icon,
		collapsed = false
	}: {
		title: string;
		path: string;
		icon: Component;
		collapsed?: boolean;
	} = $props();

	const active = $derived.by(() => {
		if (path === '/dashboard') {
			return page.url.pathname === '/dashboard';
		}

		return page.url.pathname.startsWith(path);
	});
</script>

<button
	type="button"
	title={collapsed ? title : undefined}
	onclick={() => goto(path)}
	class={`
		group
		w-full
		flex
		items-center
		${collapsed ? 'justify-center' : 'justify-start'}
		gap-3
		px-3
		py-3
		rounded-xl
		transition-all
		duration-200

		${
			active
				? 'bg-blue-600 text-white shadow-lg'
				: 'text-slate-300 hover:bg-slate-800 hover:text-white'
		}
	`}
>

	<Icon
		size={20}
		class="shrink-0"
	></Icon>

	{#if !collapsed}

		<span
			class="
				font-medium
				text-sm
				truncate
			"
		>
			{title}
		</span>

	{/if}

</button>