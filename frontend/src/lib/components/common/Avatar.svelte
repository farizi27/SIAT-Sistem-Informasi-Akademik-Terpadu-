<script lang="ts">
	let {
		name = '',
		src = '',
		size = 'md'
	}: {
		name?: string;
		src?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
	} = $props();

	const sizes = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-14 h-14 text-lg',
		xl: 'w-20 h-20 text-2xl'
	};

	const initial = $derived.by(() => {
	if (!name) return '?';

	return name
		.trim()
		.split(' ')
		.map((n) => n[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
    });
</script>

{#if src}
	<img
		src={src}
		alt={name}
		class={`${
			sizes[size]
		} rounded-full object-cover border border-slate-200 shadow-sm`}
	/>
{:else}
	<div
		class={`${
			sizes[size]
		} rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold select-none shadow-sm`}
	>
		{initial}
	</div>
{/if}