<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';
	import Swal from 'sweetalert2';
	import { logActivity } from '$lib/utils/activityLog';

	import {
		createMahasiswa,
		updateMahasiswa,
		type Mahasiswa
	} from '$lib/api/mahasiswa';

	import { getAllProdi } from '$lib/api/prodi';

	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: Mahasiswa | null;
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
		name: '',
		email: '',
		password: '',
		nim: '',
		prodi: '',
		angkatan: ''
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
			console.log('[MahasiswaForm] Prodi loaded:', prodiOptions);
		} catch (err) {
			console.error('[MahasiswaForm] Failed to load prodi:', err);
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
			name: '',
			email: '',
			password: '',
			nim: '',
			prodi: '',
			angkatan: ''
		};
		errorMsg = '';
	}

	$effect(() => {
		if (!open) return;

		if (editMode && data) {
			form.name = data.name;
			form.email = data.email;
			form.nim = data.nim;
			form.angkatan = String(data.angkatan);
			form.prodi = String(data.prodiId);
		} else {
			resetForm();
		}

		// Reload prodi jika belum ada
		if (prodiOptions.length === 0) {
			loadProdi();
		}
	});

	async function submit() {
		errorMsg = '';

		// Validasi sisi frontend
		if (!form.name.trim()) {
			errorMsg = 'Nama wajib diisi.';
			return;
		}
		if (!form.email.trim()) {
			errorMsg = 'Email wajib diisi.';
			return;
		}
		if (!editMode && !form.password.trim()) {
			errorMsg = 'Password wajib diisi.';
			return;
		}
		if (!form.nim.trim() || form.nim.trim().length < 8) {
			errorMsg = 'NIM wajib diisi dan minimal 8 digit.';
			return;
		}
		if (!form.prodi || form.prodi === '') {
			errorMsg = 'Program Studi wajib dipilih.';
			return;
		}
		if (!form.angkatan || String(form.angkatan).trim() === '') {
			errorMsg = 'Angkatan wajib diisi.';
			return;
		}

		loading = true;
		try {
			const payload = {
				name: form.name.trim(),
				email: form.email.trim(),
				password: form.password,
				nim: form.nim.trim(),
				prodi: Number(form.prodi),
				angkatan: Number(form.angkatan)
			};

			console.log('[MahasiswaForm] Submitting payload:', payload);

			if (editMode && data) {
				await updateMahasiswa(data.id, payload);
				logActivity({ type: 'update', module: 'Mahasiswa', description: `Data mahasiswa "${payload.name}" berhasil diperbarui.` });
			} else {
				await createMahasiswa(payload);
				logActivity({ type: 'create', module: 'Mahasiswa', description: `Mahasiswa baru "${payload.name}" (NIM: ${payload.nim}) berhasil ditambahkan.` });
			}

			console.log('[MahasiswaForm] Success!');
			resetForm();
			onSuccess();
		} catch (err: any) {
			console.error('[MahasiswaForm] Error:', err);
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
</script>

<Modal
	open={open}
	title={editMode ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
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
				label="Nama Lengkap"
				name="name"
				placeholder="Masukkan nama mahasiswa"
				required
				bind:value={form.name}
			/>

			<FormInput
				label="Email"
				name="email"
				type="email"
				placeholder="Masukkan email"
				required
				bind:value={form.email}
			/>

		</div>

		{#if !editMode}

			<FormInput
				label="Password"
				name="password"
				type="password"
				placeholder="Masukkan password (default: NIM jika kosong)"
				bind:value={form.password}
			/>

		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

			<FormInput
				label="NIM (minimal 8 digit angka)"
				name="nim"
				placeholder="Contoh: 12345678"
				required
				bind:value={form.nim}
			/>

			<FormInput
				label="Angkatan"
				name="angkatan"
				type="text"
				placeholder="Contoh: 2024"
				required
				bind:value={form.angkatan}
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
				name="prodi"
				required
				options={prodiOptions}
				bind:value={form.prodi}
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
				{editMode ? 'Simpan Perubahan' : 'Tambah Mahasiswa'}
			</Button>

		</div>

	</div>

</Modal>