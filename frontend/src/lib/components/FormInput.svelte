<script lang="ts">
	let {
		id,
		label,
		value = $bindable(),
		type = 'text',
		placeholder = ''
	} = $props<{
		id: string;
		label: string;
		value: string;
		type?: string;
		placeholder?: string;
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

	<input
		id={id}
		bind:value
		type={type}
		placeholder={placeholder}
		class="
			w-full
			border
			rounded-xl
			p-3
			focus:outline-none
			focus:ring-2
			focus:ring-blue-500
		"
	/>

</div>