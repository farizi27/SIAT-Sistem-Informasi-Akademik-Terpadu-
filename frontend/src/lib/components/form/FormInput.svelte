<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label = '',
		name = '',
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		required = false,
		disabled = false,
		error = '',
		children
	}: {
		label?: string;
		name?: string;
		type?: string;
		placeholder?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="space-y-2">

	{#if label}
		<label
			for={name}
			class="block text-sm font-medium text-slate-700"
		>
			{label}

			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative">

		<input
			id={name}
			name={name}
			{type}
			bind:value
			{placeholder}
			{required}
			{disabled}
			class={`
				w-full
				rounded-xl
				border
				bg-white
				px-4
				py-2.5
				text-sm
				outline-none
				transition-all
				duration-200
				disabled:bg-slate-100
				disabled:cursor-not-allowed
				${
					error
						? 'border-red-500 focus:ring-2 focus:ring-red-200'
						: 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
				}
			`}
		/>

		{#if children}

			<div class="absolute right-3 top-1/2 -translate-y-1/2">

				{@render children()}

			</div>

		{/if}

	</div>

	{#if error}
		<p class="text-sm text-red-500">
			{error}
		</p>
	{/if}

</div>