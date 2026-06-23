<script lang="ts">
	let {
		title,
		description = '',
		buttonText = '',
		onAdd
	} = $props<{
		title: string;
		description?: string;
		buttonText?: string;
		onAdd?: () => void;
	}>();
</script>

<div class="flex justify-between items-center mb-6">

	<div>

		<h1
			class="text-3xl font-bold text-slate-800"
		>
			{title}
		</h1>

		<p
			class="text-slate-500 mt-1"
		>
			{description}
		</p>

	</div>

	{#if buttonText}

		<button
			onclick={onAdd}
			class="
				bg-blue-600
				text-white
				px-4
				py-2
				rounded-xl
				hover:bg-blue-700
				transition
			"
		>
			+ {buttonText}
		</button>

	{/if}

</div>