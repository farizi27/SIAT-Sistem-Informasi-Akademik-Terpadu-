<script lang="ts">
	let {
		page = 1,
		totalPages = 1,
		onPageChange
	}: {
		page: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	} = $props();

	const pages = $derived.by(() => {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	});

	function previous() {
		if (page > 1) {
			onPageChange(page - 1);
		}
	}

	function next() {
		if (page < totalPages) {
			onPageChange(page + 1);
		}
	}
</script>

<div class="flex items-center justify-between mt-6">

	<p class="text-sm text-slate-500">
		Halaman
		<span class="font-semibold">{page}</span>
		dari
		<span class="font-semibold">{totalPages}</span>
	</p>

	<div class="flex items-center gap-2">

		<button
			onclick={previous}
			disabled={page === 1}
			class="
				px-3
				py-2
				text-sm
				border
				border-slate-300
				rounded-xl
				bg-white
				hover:bg-slate-100
				disabled:opacity-50
				disabled:cursor-not-allowed
			"
		>
			Sebelumnya
		</button>

		{#each pages as number}

			<button
				onclick={() => onPageChange(number)}
				class={`
					w-10
					h-10
					rounded-xl
					text-sm
					font-medium
					transition-all
					duration-200
					${
						number === page
							? 'bg-blue-600 text-white'
							: 'bg-white border border-slate-300 hover:bg-slate-100'
					}
				`}
			>
				{number}
			</button>

		{/each}

		<button
			onclick={next}
			disabled={page === totalPages}
			class="
				px-3
				py-2
				text-sm
				border
				border-slate-300
				rounded-xl
				bg-white
				hover:bg-slate-100
				disabled:opacity-50
				disabled:cursor-not-allowed
			"
		>
			Selanjutnya
		</button>

	</div>

</div>