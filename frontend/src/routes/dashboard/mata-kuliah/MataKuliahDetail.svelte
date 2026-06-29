<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	import type { MataKuliah } from '$lib/api/mataKuliah';

	interface Props {
		open: boolean;
		data: MataKuliah | null;
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
	title="Detail Mata Kuliah"
	size="md"
	{onClose}
>
	{#if data}
		<div class="space-y-5">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Kode Mata Kuliah</p>
					<p class="font-semibold">{data.kode}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Nama Mata Kuliah</p>
					<p class="font-semibold">{data.nama}</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-slate-500">Jumlah SKS</p>
					<p class="font-semibold">{data.sks} SKS</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Semester</p>
					<p class="font-semibold">Semester {data.semester}</p>
				</div>
			</div>

			<div>
				<p class="text-sm text-slate-500">Program Studi</p>
				<p class="font-semibold">{data.namaProdi || '-'}</p>
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
