<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { deleteKRS, type KRS } from '$lib/api/krs';

	interface Props {
		open: boolean;
		data: KRS | null;
		onClose: () => void;
		onSuccess: () => void;
	}

	let {
		open,
		data,
		onClose,
		onSuccess
	}: Props = $props();

	let loading = $state(false);

	async function handleDelete() {

		if (!data) return;

		loading = true;

		try {

			await deleteKRS(data.id);

			onSuccess();

		} catch (err) {

			console.error('Gagal menghapus KRS:', err);

		} finally {

			loading = false;

		}

	}
</script>

<Modal
	open={open}
	title="Hapus KRS"
	size="sm"
	{onClose}
>
	{#if data}

		<div class="space-y-5">

			<div class="flex items-center gap-4">

				<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
					<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
					</svg>
				</div>

				<div>

					<h3 class="font-semibold text-slate-800">
						Konfirmasi Penghapusan
					</h3>

					<p class="text-sm text-slate-500 mt-1">
						Apakah Anda yakin ingin menghapus KRS
						<span class="font-semibold text-slate-700">
							{data.namaMahasiswa ?? `ID: ${data.id}`}
						</span>
						dari kelas
						<span class="font-semibold text-slate-700">
							{data.namaKelas ?? `ID: ${data.kelasId}`}
						</span>?
						Tindakan ini tidak dapat dibatalkan.
					</p>

				</div>

			</div>

			<div class="pt-4 border-t border-slate-200 flex justify-end gap-3">

				<Button
					variant="secondary"
					type="button"
					onclick={onClose}
				>
					Batal
				</Button>

				<Button
					variant="danger"
					type="button"
					loading={loading}
					onclick={handleDelete}
				>
					Hapus
				</Button>

			</div>

		</div>

	{/if}

</Modal>
