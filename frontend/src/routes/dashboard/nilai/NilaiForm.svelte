<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import Swal from 'sweetalert2';
	import { logActivity } from '$lib/utils/activityLog';

	import { updateKRSGrade, type KRS } from '$lib/api/krs';

	let { open, data, onClose, onSuccess } = $props<{
		open: boolean;
		data: KRS | null;
		onClose: () => void;
		onSuccess: () => void;
	}>();

	let loading = $state(false);

	let error = $state('');

	// Dropdown pilihan nilai (hanya ini yang diterima backend)
	const pilihanNilai = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E'];

	// State internal untuk form
	let nilaiForm = $state('');

	$effect(() => {
		if (open) {
			error = '';
			if (data) {
				// Pastikan nilai form terisi dengan nilai yang sudah ada atau string kosong
				nilaiForm = data.nilai || '';
			} else {
				nilaiForm = '';
			}
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!data) return;
		if (!nilaiForm) {
			error = 'Silakan pilih nilai terlebih dahulu.';
			return;
		}

		error = '';
		loading = true;

		try {
			await updateKRSGrade(data.id, nilaiForm);
			logActivity({ type: 'nilai', module: 'Nilai', description: `Nilai mahasiswa "${data.namaMahasiswa}" pada "${data.namaMataKuliah}" diubah menjadi ${nilaiForm}.` });
			Swal.fire({
				icon: 'success',
				title: 'Berhasil!',
				text: 'Nilai mahasiswa berhasil diperbarui.',
				showConfirmButton: false,
				timer: 1500
			});
			onSuccess();
		} catch (err: any) {
			console.error('[NilaiForm] Error updating nilai:', err);
			const message = err.response?.data?.message || 'Gagal menyimpan nilai.';
			error = message;
			Swal.fire({
				icon: 'error',
				title: 'Gagal',
				text: message
			});
		} finally {
			loading = false;
		}
	}
</script>

<Modal
	{open}
	title="Ubah Nilai Mahasiswa"
	size="md"
	onClose={!loading ? onClose : undefined}
>
	<form onsubmit={handleSubmit} class="space-y-4">
		{#if error}
			<div class="rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Terdapat Kesalahan</h3>
						<div class="mt-2 text-sm text-red-700">
							<p>{error}</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if data}
			<!-- Info Read-Only -->
			<div class="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-100 mb-4 text-sm">
				<div class="grid grid-cols-3">
					<span class="text-slate-500 font-medium">Mahasiswa</span>
					<span class="col-span-2 text-slate-800 font-semibold">{data.namaMahasiswa} ({data.nim})</span>
				</div>
				<div class="grid grid-cols-3">
					<span class="text-slate-500 font-medium">Mata Kuliah</span>
					<span class="col-span-2 text-slate-800 font-semibold">{data.namaMataKuliah} - {data.kodeMataKuliah}</span>
				</div>
				<div class="grid grid-cols-3">
					<span class="text-slate-500 font-medium">Kelas</span>
					<span class="col-span-2 text-slate-800">{data.kodeKelas} / {data.sks} SKS</span>
				</div>
				<div class="grid grid-cols-3">
					<span class="text-slate-500 font-medium">Periode</span>
					<span class="col-span-2 text-slate-800">{data.tahunAjaran} ({data.periode})</span>
				</div>
			</div>

			<!-- Input Pilihan Nilai -->
			<div>
				<label for="nilai" class="block text-sm font-medium text-slate-700">
					Nilai Akhir <span class="text-red-500">*</span>
				</label>
				<select
					id="nilai"
					class="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm bg-white"
					bind:value={nilaiForm}
					disabled={loading}
					required
				>
					<option value="" disabled>-- Pilih Nilai --</option>
					{#each pilihanNilai as pNilai}
						<option value={pNilai}>{pNilai}</option>
					{/each}
				</select>
			</div>
		{/if}

		<div class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
			<Button
				variant="secondary"
				type="button"
				onclick={onClose}
				disabled={loading}
			>
				Batal
			</Button>
			<Button
				variant="primary"
				type="submit"
				disabled={loading}
			>
				{#if loading}
					<div class="flex items-center gap-2">
						<LoadingSpinner size="sm" />
						<span>Menyimpan...</span>
					</div>
				{:else}
					Simpan Nilai
				{/if}
			</Button>
		</div>
	</form>
</Modal>
