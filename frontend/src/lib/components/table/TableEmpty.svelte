<script lang="ts">
	import { Inbox } from '@lucide/svelte';

	let {
		colspan = 1,
		title = 'Tidak ada data',
		description = 'Belum ada data yang dapat ditampilkan.'
	}: {
		colspan?: number;
		title?: string;
		description?: string;
	} = $props();
</script>

<tr>
	<td colspan={colspan} class="px-6 py-12">

		<div class="flex flex-col items-center justify-center text-center">

			<div
				class="
					w-16
					h-16
					rounded-full
					bg-slate-100
					flex
					items-center
					justify-center
					mb-4
				"
			>
				<Inbox
					size={30}
					class="text-slate-400"
				></Inbox>
			</div>

			<h3
				class="
					text-lg
					font-semibold
					text-slate-700
				"
			>
				{title}
			</h3>

			<p
				class="
					mt-1
					text-sm
					text-slate-500
				"
			>
				{description}
			</p>

		</div>

	</td>
</tr>