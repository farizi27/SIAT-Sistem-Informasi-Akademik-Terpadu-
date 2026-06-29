<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	import type { Semester } from '$lib/api/semester';

	interface Props {
		open: boolean;
		data: Semester | null;
		onClose: () => void;
	}

	let {
		open,
		data,
		onClose
	}: Props = $props();
</script>

<Modal
	open={open}
	title="Detail Semester"
	size="md"
	{onClose}
>
	{#if data}
		<div class="space-y-5">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Tahun Ajaran</p>
					<p class="font-semibold">{data.tahunAjaran}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Periode</p>
					<p class="font-semibold">{data.periode}</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Status</p>
					<span
						class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
							data.isActive
								? 'bg-green-100 text-green-700'
								: 'bg-slate-100 text-slate-600'
						}`}
					>
						{data.isActive ? 'Aktif (Semester Berjalan)' : 'Tidak Aktif'}
					</span>
				</div>

				{#if data.createdAt}
					<div>
						<p class="text-sm text-slate-500">Dibuat Pada</p>
						<p class="font-semibold">{new Date(data.createdAt).toLocaleString('id-ID')}</p>
					</div>
				{/if}
			</div>

			<div class="pt-4 border-t border-slate-200 flex justify-end">
				<Button
					variant="secondary"
					onclick={onClose}
				>
					Tutup
				</Button>
			</div>
		</div>
	{/if}
</Modal>
