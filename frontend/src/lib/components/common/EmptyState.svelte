<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { Inbox } from '@lucide/svelte';

	let {
		icon = Inbox,
		title = 'Data Tidak Ditemukan',
		description = 'Belum ada data yang tersedia.',
		children
	}: {
		icon?: Component;
		title?: string;
		description?: string;
		children?: Snippet;
	} = $props();

	const Icon = $derived.by(() => icon);
</script>

<div
	class="
		w-full
		bg-white
		border
		border-slate-200
		rounded-2xl
		py-14
		px-6
		flex
		flex-col
		items-center
		justify-center
		text-center
	"
>

	<div
		class="
			w-16
			h-16
			rounded-full
			bg-slate-100
			flex
			items-center
			justify-center
			mb-5
		"
	>
		<Icon
			size={30}
			class="text-slate-500"
		></Icon>
	</div>

	<h2
		class="
			text-xl
			font-semibold
			text-slate-800
			mb-2
		"
	>
		{title}
	</h2>

	<p
		class="
			text-sm
			text-slate-500
			max-w-md
			mb-6
		"
	>
		{description}
	</p>

	{#if children}

		<div>

			{@render children()}

		</div>

	{/if}

</div>