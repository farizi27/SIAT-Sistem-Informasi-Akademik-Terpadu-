<script lang="ts">

	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';

	import {
		createMahasiswa,
		updateMahasiswa,
		type Mahasiswa
	} from '$lib/api/mahasiswa';

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

	let form = $state({
		name: '',
		email: '',
		password: '',
		nim: '',
		prodi: '',
		angkatan: ''
	});

	let prodiOptions = $state([
		{
			label: 'Informatika',
			value: 1
		},
		{
			label: 'Sistem Informasi',
			value: 2
		},
		{
			label: 'Teknik Komputer',
			value: 3
		}
	]);

	function resetForm() {

		form = {
			name: '',
			email: '',
			password: '',
			nim: '',
			prodi: '',
			angkatan: ''
		};

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

    });

	async function submit() {

		loading = true;

		try {

			const payload = {

				name: form.name,

				email: form.email,

				password: form.password,

				nim: form.nim,

				prodi: Number(form.prodi),

				angkatan: Number(
					form.angkatan
				)

			};

			if (editMode && data) {

				await updateMahasiswa(
					data.id,
					payload
				);

			} else {

				await createMahasiswa(
					payload
				);

			}

			resetForm();

			onSuccess();

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
				placeholder="Masukkan password"
				required
				bind:value={form.password}
			/>

		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

			<FormInput
				label="NIM"
				name="nim"
				placeholder="Masukkan NIM"
				required
				bind:value={form.nim}
			/>

			<FormInput
				label="Angkatan"
				name="angkatan"
				type="number"
				placeholder="Contoh: 2024"
				required
				bind:value={form.angkatan}
			/>

		</div>

		<FormSelect
			label="Program Studi"
			name="prodi"
			required
			options={prodiOptions}
			bind:value={form.prodi}
		/>

		<div
			class="
				pt-4
				border-t
				border-slate-200
				flex
				justify-end
				gap-3
			"
		>

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