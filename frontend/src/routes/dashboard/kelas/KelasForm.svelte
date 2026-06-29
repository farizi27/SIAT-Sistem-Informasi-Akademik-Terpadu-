<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';
	import Swal from 'sweetalert2';
	import { logActivity } from '$lib/utils/activityLog';

	import {
		createKelas,
		updateKelas,
		type Kelas
	} from '$lib/api/kelas';

	import { getAllMataKuliah } from '$lib/api/mataKuliah';
	import { getAllDosen } from '$lib/api/dosen';
	import { getAllSemester } from '$lib/api/semester';
	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: Kelas | null;
		onClose: () => void;
		onSuccess: () => void;
	}

	let {
		open,
		editMode,
		data,
		onClose,
		onSuccess
	}: Props = $props();

	let loading = $state(false);
	let dataLoading = $state(false);
	let errorMsg = $state('');

	let form = $state({
		kodeKelas: '',
		mataKuliahId: '',
		dosenId: '',
		semesterId: '',
		kapasitas: '',
		status: 'AKTIF'
	});

	let mkOptions = $state<{ label: string; value: string }[]>([]);
	let dosenOptions = $state<{ label: string; value: string }[]>([]);
	let semesterOptions = $state<{ label: string; value: string }[]>([]);

	async function loadDropdownData() {
		dataLoading = true;
		try {
			const [mkList, dosenList, semList] = await Promise.all([
				getAllMataKuliah(),
				getAllDosen(),
				getAllSemester()
			]);

			mkOptions = mkList.map((item) => ({
				label: `${item.nama} (${item.kode})`,
				value: String(item.id)
			}));

			dosenOptions = dosenList.map((item) => ({
				label: `${item.name} (NIDN: ${item.nidn})`,
				value: String(item.id)
			}));

			semesterOptions = semList.map((item) => ({
				label: `${item.tahunAjaran} (${item.periode})`,
				value: String(item.id)
			}));
		} catch (err) {
			console.error('[KelasForm] Failed to load dropdown data:', err);
		} finally {
			dataLoading = false;
		}
	}

	onMount(() => {
		loadDropdownData();
	});

	function resetForm() {
		form = {
			kodeKelas: '',
			mataKuliahId: '',
			dosenId: '',
			semesterId: '',
			kapasitas: '',
			status: 'AKTIF'
		};
		errorMsg = '';
	}

	$effect(() => {
		if (!open) return;

		if (editMode && data) {
			form.kodeKelas = data.kodeKelas;
			form.mataKuliahId = String(data.mataKuliahId);
			form.dosenId = String(data.dosenId);
			form.semesterId = String(data.semesterId);
			form.kapasitas = String(data.kapasitas);
			form.status = data.status;
		} else {
			resetForm();
		}

		if (mkOptions.length === 0 || dosenOptions.length === 0 || semesterOptions.length === 0) {
			loadDropdownData();
		}
	});

	async function submit() {
		errorMsg = '';

		// Validation
		if (!form.kodeKelas.trim()) {
			errorMsg = 'Kode Kelas wajib diisi.';
			return;
		}
		if (!editMode && (!form.mataKuliahId || form.mataKuliahId === '')) {
			errorMsg = 'Mata Kuliah wajib dipilih.';
			return;
		}
		if (!form.dosenId || form.dosenId === '') {
			errorMsg = 'Dosen Pengampu wajib dipilih.';
			return;
		}
		if (!editMode && (!form.semesterId || form.semesterId === '')) {
			errorMsg = 'Semester wajib dipilih.';
			return;
		}
		const kapVal = Number(form.kapasitas);
		if (!form.kapasitas || isNaN(kapVal) || kapVal <= 0) {
			errorMsg = 'Kapasitas wajib diisi dengan angka positif.';
			return;
		}

		loading = true;
		try {
			if (editMode && data) {
				const payload = {
					kodeKelas: form.kodeKelas.trim().toUpperCase(),
					dosenId: Number(form.dosenId),
					kapasitas: kapVal,
					status: form.status as 'AKTIF' | 'NONAKTIF'
				};
				console.log('[KelasForm] Editing class payload:', payload);
				await updateKelas(data.id, payload);
				logActivity({ type: 'update', module: 'Kelas', description: `Kelas "${payload.kodeKelas}" berhasil diperbarui.` });
			} else {
				const payload = {
					kodeKelas: form.kodeKelas.trim().toUpperCase(),
					mataKuliahId: Number(form.mataKuliahId),
					dosenId: Number(form.dosenId),
					semesterId: Number(form.semesterId),
					kapasitas: kapVal
				};
				console.log('[KelasForm] Creating class payload:', payload);
				await createKelas(payload);
				logActivity({ type: 'create', module: 'Kelas', description: `Kelas baru "${payload.kodeKelas}" (kapasitas ${payload.kapasitas}) berhasil ditambahkan.` });
			}

			resetForm();
			onSuccess();
		} catch (err: any) {
			console.error('[KelasForm] Error:', err);
			const msg =
				err?.response?.data?.errors?.join(', ') ||
				err?.response?.data?.message ||
				'Terjadi kesalahan pada server.';
			Swal.fire({
				icon: 'error',
				title: 'Gagal Menyimpan!',
				text: msg
			});
		} finally {
			loading = false;
		}
	}

	const statusOptions = [
		{ label: 'AKTIF', value: 'AKTIF' },
		{ label: 'NONAKTIF', value: 'NONAKTIF' }
	];
</script>

<Modal
	open={open}
	title={editMode ? 'Edit Kelas' : 'Tambah Kelas'}
	size="lg"
	onClose={() => {
		resetForm();
		onClose();
	}}
>
	<div class="space-y-5">
		{#if errorMsg}
			<div class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
				{errorMsg}
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<FormInput
				label="Kode Kelas"
				name="kodeKelas"
				placeholder="Contoh: IF-A, IF-B"
				required
				bind:value={form.kodeKelas}
			/>

			<FormInput
				label="Kapasitas (jumlah mahasiswa)"
				name="kapasitas"
				type="text"
				placeholder="Contoh: 40"
				required
				bind:value={form.kapasitas}
			/>
		</div>

		{#if dataLoading}
			<p class="text-sm text-slate-500">Memuat data dropdown...</p>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#if !editMode}
					<FormSelect
						label="Mata Kuliah"
						name="mataKuliahId"
						required
						options={mkOptions}
						bind:value={form.mataKuliahId}
					/>
				{/if}

				<FormSelect
					label="Dosen Pengampu"
					name="dosenId"
					required
					options={dosenOptions}
					bind:value={form.dosenId}
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#if !editMode}
					<FormSelect
						label="Semester"
						name="semesterId"
						required
						options={semesterOptions}
						bind:value={form.semesterId}
					/>
				{:else}
					<FormSelect
						label="Status"
						name="status"
						required
						options={statusOptions}
						bind:value={form.status}
					/>
				{/if}
			</div>
		{/if}

		<div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
			<Button
				variant="secondary"
				type="button"
				onclick={() => {
					resetForm();
					onClose();
				}}
			>
				Batal
			</Button>

			<Button
				type="button"
				loading={loading}
				onclick={submit}
			>
				{editMode ? 'Simpan Perubahan' : 'Tambah Kelas'}
			</Button>
		</div>
	</div>
</Modal>
