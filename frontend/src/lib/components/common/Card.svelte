<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		subtitle = '',
		padding = 'md',
		hover = false,
		children
	}: {
		title?: string;
		subtitle?: string;
		padding?: 'sm' | 'md' | 'lg';
		hover?: boolean;
		children?: Snippet;
	} = $props();

	const paddingClass = $derived.by(() => {
		switch (padding) {
			case 'sm':
				return 'p-4';

			case 'lg':
				return 'p-8';

			default:
				return 'p-6';
		}
	});
</script>

<div
	class={`
		bg-white
		rounded-2xl
		border
		border-slate-200
		shadow-sm
		transition-all
		duration-200
		${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
	`}
>

	{#if title || subtitle}

		<div class={`${paddingClass} border-b border-slate-100`}>

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

	<div class={paddingClass}>

		{@render children?.()}

	</div>

</div>