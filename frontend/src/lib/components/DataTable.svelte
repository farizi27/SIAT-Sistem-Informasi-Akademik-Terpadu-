<script lang="ts">
	let {
		headers = [],
		rows = []
	} = $props<{
		headers: string[];
		rows: any[];
	}>();
</script>

<div
	class="
		bg-white
		rounded-2xl
		border
		shadow-sm
		overflow-hidden
	"
>

	<table class="w-full">

		<thead
			class="
				bg-slate-50
				text-slate-700
			"
		>

			<tr>

				{#each headers as header}

					<th
						class="
							text-left
							px-5
							py-4
							font-semibold
						"
					>
						{header}
					</th>

				{/each}

			</tr>

		</thead>

		<tbody>

			{#each rows as row}

				<tr
					class="
						border-t
						hover:bg-slate-50
						transition
					"
				>

					{#each Object.values(row) as value}

						<td
							class="
								px-5
								py-4
							"
						>
							{value}
						</td>

					{/each}

				</tr>

			{/each}

		</tbody>

	</table>

</div>