<script lang="ts">

	let {
		page,
		totalPages,
		onPrevious,
		onNext
	} = $props<{
		page: number;
		totalPages: number;
		onPrevious: () => void;
		onNext: () => void;
	}>();

</script>

<div
	class="
		flex
		items-center
		justify-end
		gap-3
		mt-5
	"
>

	<button
		onclick={onPrevious}
		disabled={page <= 1}
		class="
			px-4
			py-2
			border
			rounded-xl
			disabled:opacity-50
		"
	>
		Sebelumnya
	</button>

	<span>
		Halaman {page}
		dari {totalPages}
	</span>

	<button
		onclick={onNext}
		disabled={page >= totalPages}
		class="
			px-4
			py-2
			bg-blue-600
			text-white
			rounded-xl
			disabled:opacity-50
		"
	>
		Berikutnya
	</button>

</div>