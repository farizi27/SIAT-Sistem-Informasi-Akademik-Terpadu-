<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant =
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'outline';

	type Size =
		| 'sm'
		| 'md'
		| 'lg';

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		fullWidth = false,
		children,
		onclick
	}: {
		type?: 'button' | 'submit' | 'reset';
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		loading?: boolean;
		fullWidth?: boolean;
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
	} = $props();

	const variantClass = {
		primary:
			'bg-blue-600 hover:bg-blue-700 text-white',

		secondary:
			'bg-slate-700 hover:bg-slate-800 text-white',

		success:
			'bg-emerald-600 hover:bg-emerald-700 text-white',

		danger:
			'bg-red-600 hover:bg-red-700 text-white',

		warning:
			'bg-amber-500 hover:bg-amber-600 text-white',

		outline:
			'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
	};

	const sizeClass = {
		sm: 'px-2 py-2 text-sm my-1',
		md: 'px-4 py-2.5 text-sm',
		lg: 'px-5 py-3 text-base'
	};
</script>

<button
	{type}
	disabled={disabled || loading}
	onclick={onclick}
	class={`
		inline-flex
		items-center
		justify-center
		gap-2
		font-medium
		rounded-xl
		transition-all
		duration-200
		active:scale-95
		disabled:opacity-50
		disabled:cursor-not-allowed
		${variantClass[variant]}
		${sizeClass[size]}
		${fullWidth ? 'w-full' : ''}
	`}
>

	{#if loading}

		<svg
			class="animate-spin h-4 w-4"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			/>

			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
			/>
		</svg>

	{/if}

	{@render children?.()}

</button>