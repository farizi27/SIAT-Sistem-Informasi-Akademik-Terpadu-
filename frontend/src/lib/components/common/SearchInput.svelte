<script lang="ts">
	import { Search, X } from '@lucide/svelte';

	let {
		value = '',
		placeholder = 'Cari...',
		disabled = false,
		onSearch,
		onClear
	}: {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		onSearch?: (value: string) => void;
		onClear?: () => void;
	} = $props();

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		value = target.value;
		onSearch?.(value);
	}

	function clear() {
		value = '';
		onClear?.();
		onSearch?.('');
	}
</script>

<div class="relative w-full">

	<div
		class="
			absolute
			left-3
			top-1/2
			-transform
			-translate-y-1/2
			text-slate-400
		"
	>
		<Search size={18}></Search>
	</div>

	<input
		type="text"
		bind:value
		placeholder={placeholder}
		disabled={disabled}
		oninput={handleInput}
		class="
			w-full
			pl-10
			pr-10
			py-2.5
			border
			border-slate-300
			rounded-xl
			bg-white
			text-sm
			outline-none
			transition-all
			duration-200
			focus:ring-2
			focus:ring-blue-500
			focus:border-blue-500
			disabled:bg-slate-100
			disabled:cursor-not-allowed
		"
	/>

	{#if value}

		<button
			type="button"
			onclick={clear}
			class="
				absolute
				right-3
				top-1/2
				-transform
				-translate-y-1/2
				text-slate-400
				hover:text-red-500
				transition-colors
			"
		>
			<X size={18}></X>
		</button>

	{/if}

</div>