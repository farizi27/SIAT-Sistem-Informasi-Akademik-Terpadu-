<script lang="ts">
	export interface Option {
		label: string;
		value: string | number;
	}

	let {
		label = '',
		name = '',
		value = $bindable(''),
		options = [],
		required = false,
		disabled = false,
		error = ''
	}: {
		label?: string;
		name?: string;
		value?: string | number;
		options?: Option[];
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

	<select
		id={name}
		name={name}
		bind:value
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
			${
				error
					? 'border-red-500'
					: 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
			}
		`}
	>

		<option value="">
			Pilih...
		</option>

		{#each options as option}

			<option value={option.value}>
				{option.label}
			</option>

		{/each}

	</select>

	{#if error}

		<p class="text-sm text-red-500">

			{error}

		</p>

	{/if}

</div>