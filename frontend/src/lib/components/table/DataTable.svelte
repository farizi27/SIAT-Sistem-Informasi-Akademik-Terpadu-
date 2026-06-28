<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		subtitle = '',
		children
	}: {
		title?: string;
		subtitle?: string;
		children?: Snippet;
	} = $props();
</script>

<div
	class="
		bg-white
		border
		border-slate-200
		rounded-2xl
		shadow-sm
		overflow-hidden
	"
>

	{#if title || subtitle}

		<div
			class="
				px-6
				py-4
				border-b
				border-slate-200
			"
		>

			{#if title}

				<h2
					class="
						text-lg
						font-semibold
						text-slate-800
					"
				>
					{title}
				</h2>

			{/if}

			{#if subtitle}

				<p
					class="
						mt-1
						text-sm
						text-slate-500
					"
				>
					{subtitle}
				</p>

			{/if}

		</div>

	{/if}

	<div class="overflow-x-auto">

		<table
			class="
				min-w-full
				text-sm
				text-left
			"
		>

			{@render children?.()}

		</table>

	</div>

</div>