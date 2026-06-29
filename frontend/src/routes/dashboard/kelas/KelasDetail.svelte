<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	import type { Kelas } from '$lib/api/kelas';

	interface Props {
		open: boolean;
		data: Kelas | null;
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
	title="Detail Kelas"
	size="md"
	{onClose}
>
	{#if data}
		<div class="space-y-5">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Kode Kelas</p>
					<p class="font-semibold">{data.kodeKelas}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Kapasitas Kelas</p>
					<p class="font-semibold">{data.kapasitas} Mahasiswa</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Mata Kuliah</p>
					<p class="font-semibold">{data.namaMataKuliah || '-'} ({data.kodeMataKuliah || '-'})</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Jumlah SKS</p>
					<p class="font-semibold">{data.sks || '-'} SKS</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Dosen Pengampu</p>
					<p class="font-semibold">{data.namaDosen || '-'}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Semester Akademik</p>
					<p class="font-semibold">{data.tahunAjaran || '-'} ({data.periode || '-'})</p>
				</div>
			</div>

			<div>
				<p class="text-sm text-slate-500">Status</p>
				<span
					class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
						data.status === 'AKTIF'
							? 'bg-green-100 text-green-700'
							: 'bg-red-100 text-red-700'
					}`}
				>
					{data.status}
				</span>
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
