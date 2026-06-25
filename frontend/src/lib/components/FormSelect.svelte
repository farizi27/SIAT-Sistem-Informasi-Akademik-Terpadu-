<script lang="ts">

	let {
        id,
		label,
		value = $bindable(),
		options = []
	} = $props<{
		label: string;
		value: string | number;
		options: {
			label: string;
			value: string | number;
		}[];
	}>();

</script>

<div class="space-y-2">

	<label
        for={id}
		class="
			text-sm
			font-medium
			text-slate-700
		"
	>
		{label}
	</label>

	<select
        id = {id}
		bind:value
		class="
			w-full
			border
			rounded-xl
			p-3
			focus:outline-none
			focus:ring-2
			focus:ring-blue-500
		"
	>

		<option value="">
			Pilih
		</option>

		{#each options as option}

			<option
				value={option.value}
			>
				{option.label}
			</option>

		{/each}

	</select>

</div>