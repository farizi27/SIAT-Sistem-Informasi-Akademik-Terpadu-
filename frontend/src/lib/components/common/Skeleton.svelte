<script lang="ts">
	let {
		width = '100%',
		height = '1rem',
		rounded = 'xl',
		count = 1
	}: {
		width?: string;
		height?: string;
		rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		count?: number;
	} = $props();

	const roundedClass = $derived.by(() => {
		switch (rounded) {
			case 'sm':
				return 'rounded-sm';

			case 'md':
				return 'rounded-md';

			case 'lg':
				return 'rounded-lg';

			case 'full':
				return 'rounded-full';

			default:
				return 'rounded-xl';
		}
	});
</script>

<div class="space-y-3">

	{#each Array(count) as _, index (index)}

		<div
			class={`
				bg-slate-200
				animate-pulse
				${roundedClass}
			`}
			style={`width:${width};height:${height};`}
		></div>

	{/each}

            </div>