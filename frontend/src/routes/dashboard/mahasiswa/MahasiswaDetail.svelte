<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import type { Mahasiswa } from '$lib/api/mahasiswa';

	interface Props {
		open: boolean;
		data: Mahasiswa | null;
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
	title="Detail Mahasiswa"
	size="md"
	{onClose}
>

	{#if data}

		<div class="space-y-5">

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						Nama
					</p>

					<p class="font-semibold">
						{data.name}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Email
					</p>

					<p class="font-semibold">
						{data.email}
					</p>

				</div>

			</div>

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						NIM
					</p>

					<p class="font-semibold">
						{data.nim}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Angkatan
					</p>

					<p class="font-semibold">
						{data.angkatan}
					</p>

				</div>

			</div>

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						Program Studi
					</p>

					<p class="font-semibold">
						{data.prodi}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Status
					</p>

					<span
						class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
							data.isActive
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						}`}
					>
						{data.isActive ? 'Aktif' : 'Tidak Aktif'}
					</span>

				</div>

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