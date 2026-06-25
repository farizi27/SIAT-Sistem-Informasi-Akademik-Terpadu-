<script lang="ts">
	let {
		title = 'Data tidak ditemukan',
		description = ''
	} = $props<{
		title?: string;
		description?: string;
	}>();
</script>

<div
	class="
		bg-white
		rounded-2xl
		border
		p-12
		text-center
	"
>

	<div class="text-6xl">
		📭
	</div>

	<h3
		class="
			mt-4
			text-xl
			font-semibold
			text-slate-700
		"
	>
		{title}
	</h3>

	<p
		class="
			mt-2
			text-slate-500
		"
	>
		{description}
	</p>

</div>