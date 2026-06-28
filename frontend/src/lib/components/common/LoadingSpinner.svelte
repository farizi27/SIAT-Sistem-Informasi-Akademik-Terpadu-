<script lang="ts">
	let {
		size = 'md',
		text = '',
		fullScreen = false
	}: {
		size?: 'sm' | 'md' | 'lg';
		text?: string;
		fullScreen?: boolean;
	} = $props();

	const spinnerSize = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'w-5 h-5';

			case 'lg':
				return 'w-12 h-12';

			default:
				return 'w-8 h-8';
		}
	});
</script>

<div
	class={`
		flex
		flex-col
		items-center
		justify-center
		gap-3
		${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : ''}
	`}
>

	<div
		class={`
			${spinnerSize}
			border-4
			border-slate-200
			border-t-blue-600
			rounded-full
			animate-spin
		`}
	></div>

	{#if text}

		<p class="text-sm text-slate-600 font-medium">

			{text}

		</p>

	{/if}

</div>