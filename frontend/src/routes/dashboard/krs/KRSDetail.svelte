<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import type { KRS } from '$lib/api/krs';

	interface Props {
		open: boolean;
		data: KRS | null;
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
	title="Detail KRS"
	size="md"
	{onClose}
>
	{#if data}

		<div class="space-y-5">

			<div class="grid grid-cols-2 gap-4">

				<div>
					<p class="text-sm text-slate-500">ID KRS</p>
					<p class="font-semibold">{data.id}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Nama Mahasiswa</p>
					<p class="font-semibold">{data.namaMahasiswa ?? '-'}</p>
				</div>

			</div>

			<div class="grid grid-cols-2 gap-4">

				<div>
					<p class="text-sm text-slate-500">NIM</p>
					<p class="font-semibold">{data.nim ?? '-'}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">Kelas</p>
					<p class="font-semibold">{data.namaKelas ?? '-'}</p>
				</div>

			</div>

			<div class="grid grid-cols-2 gap-4">

				<div>
					<p class="text-sm text-slate-500">Mata Kuliah</p>
					<p class="font-semibold">{data.namaMataKuliah ?? '-'}</p>
				</div>

				<div>
					<p class="text-sm text-slate-500">SKS</p>
					<p class="font-semibold">{data.sks ?? '-'}</p>
				</div>

			</div>

			<div>
				<p class="text-sm text-slate-500">Semester</p>
				<p class="font-semibold">{data.semester ?? '-'}</p>
			</div>

			<div class="pt-4 border-t border-slate-200 flex justify-end">

				<button
					type="button"
					onclick={onClose}
					class="
						px-4
						py-2
						rounded-xl
						bg-slate-700
						text-white
						hover:bg-slate-800
						transition
					"
				>
					Tutup
				</button>

			</div>

		</div>

	{/if}

</Modal>
