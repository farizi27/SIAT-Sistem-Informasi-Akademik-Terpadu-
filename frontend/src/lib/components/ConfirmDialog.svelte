<script lang="ts">

	let {
		open = false,
		title = '',
		message = '',
		onConfirm,
		onCancel
	} = $props<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
		onCancel: () => void;
	}>();

</script>

{#if open}

	<div
		class="
			fixed
			inset-0
			bg-black/50
			flex
			items-center
			justify-center
			z-50
		"
	>

		<div
			class="
				bg-white
				w-full
				max-w-md
				p-6
				rounded-2xl
			"
		>

			<h2
				class="
					text-xl
					font-bold
				"
			>
				{title}
			</h2>

			<p
				class="
					mt-3
					text-slate-600
				"
			>
				{message}
			</p>

			<div
				class="
					flex
					justify-end
					gap-3
					mt-6
				"
			>

				<button
					onclick={onCancel}
					class="
						px-4
						py-2
						border
						rounded-xl
					"
				>
					Batal
				</button>

				<button
					onclick={onConfirm}
					class="
						bg-red-600
						text-white
						px-4
						py-2
						rounded-xl
					"
				>
					Hapus
				</button>

			</div>

		</div>

	</div>

{/if}