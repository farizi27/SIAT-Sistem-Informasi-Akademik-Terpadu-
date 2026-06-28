<script lang="ts">
	let {
		label = '',
		name = '',
		rows = 4,
		placeholder = '',
		value = $bindable(''),
		required = false,
		disabled = false,
		error = ''
	}: {
		label?: string;
		name?: string;
		rows?: number;
		placeholder?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
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

	<textarea
		id={name}
		name={name}
		bind:value
		{rows}
		{placeholder}
		{required}
		{disabled}
		class={`
			w-full
			rounded-xl
			border
			bg-white
			px-4
			py-3
			text-sm
			outline-none
			resize-none
			transition-all
			duration-200
			disabled:bg-slate-100
			${
				error
					? 'border-red-500'
					: 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
			}
		`}
	></textarea>

	{#if error}

		<p class="text-sm text-red-500">

			{error}

		</p>

	{/if}

</div>