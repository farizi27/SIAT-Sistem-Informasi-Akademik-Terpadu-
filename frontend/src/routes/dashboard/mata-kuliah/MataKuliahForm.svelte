<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';
	import Swal from 'sweetalert2';
	import { logActivity } from '$lib/utils/activityLog';

	import {
		createMataKuliah,
		updateMataKuliah,
		type MataKuliah
	} from '$lib/api/mataKuliah';

	import { getAllProdi } from '$lib/api/prodi';
	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: MataKuliah | null;
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
	let prodiLoading = $state(false);
	let errorMsg = $state('');

	let form = $state({
		kode: '',
		nama: '',
		sks: '',
		semester: '',
		prodiId: ''
	});

	let prodiOptions = $state<{ label: string; value: string }[]>([]);

	async function loadProdi() {
		prodiLoading = true;
		try {
			const prodiList = await getAllProdi();
			prodiOptions = prodiList.map((item) => ({
				label: item.nama,
				value: String(item.id)
			}));
		} catch (err) {
			console.error('[MataKuliahForm] Failed to load prodi:', err);
			prodiOptions = [];
		} finally {
			prodiLoading = false;
		}
	}

	onMount(() => {
		loadProdi();
	});

	function resetForm() {
		form = {
			kode: '',
			nama: '',
			sks: '',
			semester: '',
			prodiId: ''
		};
		errorMsg = '';
	}

	$effect(() => {
		if (!open) return;

		if (editMode && data) {
			form.kode = data.kode;
			form.nama = data.nama;
			form.sks = String(data.sks);
			form.semester = String(data.semester);
			form.prodiId = String(data.prodiId);
		} else {
			resetForm();
		}

		if (prodiOptions.length === 0) {
			loadProdi();
		}
	});

	async function submit() {
		errorMsg = '';

		// Validation
		if (!form.kode.trim()) {
			errorMsg = 'Kode mata kuliah wajib diisi.';
			return;
		}
		if (!form.nama.trim()) {
			errorMsg = 'Nama mata kuliah wajib diisi.';
			return;
		}
		const sksVal = Number(form.sks);
		if (!form.sks || isNaN(sksVal) || sksVal < 1 || sksVal > 6) {
			errorMsg = 'SKS wajib diisi (antara 1 sampai 6).';
			return;
		}
		const semVal = Number(form.semester);
		if (!form.semester || isNaN(semVal) || semVal < 1 || semVal > 8) {
			errorMsg = 'Semester wajib diisi (antara 1 sampai 8).';
			return;
		}
		if (!form.prodiId || form.prodiId === '') {
			errorMsg = 'Program Studi wajib dipilih.';
			return;
		}

		loading = true;
		try {
			const payload = {
				kode: form.kode.trim().toUpperCase(),
				nama: form.nama.trim(),
				sks: sksVal,
				semester: semVal,
				prodiId: Number(form.prodiId)
			};

			console.log('[MataKuliahForm] Submitting:', payload);

			if (editMode && data) {
				await updateMataKuliah(data.id, payload);
				logActivity({ type: 'update', module: 'Mata Kuliah', description: `Mata kuliah "${payload.nama}" (${payload.kode}) berhasil diperbarui.` });
			} else {
				await createMataKuliah(payload);
				logActivity({ type: 'create', module: 'Mata Kuliah', description: `Mata kuliah baru "${payload.nama}" (${payload.kode}, ${payload.sks} SKS) berhasil ditambahkan.` });
			}

			resetForm();
			onSuccess();
		} catch (err: any) {
			console.error('[MataKuliahForm] Error:', err);
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

	const sksOptions = [
		{ label: '1 SKS', value: '1' },
		{ label: '2 SKS', value: '2' },
		{ label: '3 SKS', value: '3' },
		{ label: '4 SKS', value: '4' },
		{ label: '5 SKS', value: '5' },
		{ label: '6 SKS', value: '6' }
	];

	const semesterOptions = [
		{ label: 'Semester 1', value: '1' },
		{ label: 'Semester 2', value: '2' },
		{ label: 'Semester 3', value: '3' },
		{ label: 'Semester 4', value: '4' },
		{ label: 'Semester 5', value: '5' },
		{ label: 'Semester 6', value: '6' },
		{ label: 'Semester 7', value: '7' },
		{ label: 'Semester 8', value: '8' }
	];
</script>

<Modal
	open={open}
	title={editMode ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
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
				label="Kode Mata Kuliah"
				name="kode"
				placeholder="Contoh: IF101"
				required
				bind:value={form.kode}
			/>

			<FormInput
				label="Nama Mata Kuliah"
				name="nama"
				placeholder="Contoh: Pemrograman Web"
				required
				bind:value={form.nama}
			/>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<FormSelect
				label="SKS"
				name="sks"
				required
				options={sksOptions}
				bind:value={form.sks}
			/>

			<FormSelect
				label="Semester"
				name="semester"
				required
				options={semesterOptions}
				bind:value={form.semester}
			/>
		</div>

		{#if prodiLoading}
			<p class="text-sm text-slate-500">Memuat daftar program studi...</p>
		{:else if prodiOptions.length === 0}
			<div class="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-700">
				⚠️ Daftar program studi tidak tersedia.
				<button class="underline ml-1" onclick={loadProdi}>Coba lagi</button>
			</div>
		{:else}
			<FormSelect
				label="Program Studi"
				name="prodiId"
				required
				options={prodiOptions}
				bind:value={form.prodiId}
			/>
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
				{editMode ? 'Simpan Perubahan' : 'Tambah Mata Kuliah'}
			</Button>
		</div>
	</div>
</Modal>
