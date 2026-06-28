<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		collapsed = false,
		children
	}: {
		title: string;
		collapsed?: boolean;
		children?: Snippet;
	} = $props();
</script>

<div class="mb-6">

	{#if !collapsed}

		<h2
			class="
				text-xs
				font-semibold
				text-slate-500
				uppercase
				mb-3
				px-3
			"
		>
			{title}
		</h2>

	{/if}

	<div class="space-y-2">

		{@render children?.()}

	</div>

</div>