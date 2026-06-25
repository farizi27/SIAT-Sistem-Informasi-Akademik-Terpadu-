<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = false,
		title = '',
		children
	}: {
		open: boolean;
		title: string;
		children?: Snippet;
	} = $props();
</script>

{#if open}

	<div
		class="
			fixed
			inset-0
			bg-black/50
			flex
			items-center
			justify-center
			z-50
		"
	>

		<div
			class="
				bg-white
				w-full
				max-w-lg
				rounded-2xl
				p-6
				shadow-xl
			"
		>

			<h2
				class="
					text-xl
					font-bold
					mb-4
				"
			>
				{title}
			</h2>

			{@render children?.()}

		</div>

	</div>

{/if}