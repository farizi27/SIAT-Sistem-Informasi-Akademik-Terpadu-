<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';

	import {
		createDosen,
		updateDosen,
		type Dosen
	} from '$lib/api/dosen';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: Dosen | null;
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
	let errorMessage = $state('');

	let form = $state({
		name: '',
		email: '',
		password: '',
		nidn: ''
	});

	function resetForm() {
		form = {
			name: '',
			email: '',
			password: '',
			nidn: ''
		};
		errorMessage = '';
	}

	$effect(() => {

		if (!open) return;

		if (editMode && data) {

			form.name = data.name;
			form.email = data.email;
			form.nidn = data.nidn;
			form.password = '';

		} else {

			resetForm();

		}

	});

	async function submit() {

		errorMessage = '';
		loading = true;

		try {

			if (editMode && data) {

				await updateDosen(data.id, {
					name: form.name,
					email: form.email,
					nidn: form.nidn
				});

			} else {

				await createDosen({
					name: form.name,
					email: form.email,
					nidn: form.nidn,
					password: form.password || undefined
				});

			}

			onSuccess();

		} catch (err: any) {

			const msg =
				err?.response?.data?.message ||
				err?.response?.data?.errors?.join(', ') ||
				err?.message ||
				'Terjadi kesalahan. Silakan coba lagi.';

			errorMessage = msg;
			console.error(err);

		} finally {

			loading = false;

		}

	}
</script>

<Modal
	open={open}
	title={editMode ? 'Edit Dosen' : 'Tambah Dosen'}
	size="lg"
	onClose={() => {
		resetForm();
		onClose();
	}}
>

	<div class="space-y-5">

		{#if errorMessage}
			<div class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
				⚠️ {errorMessage}
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

			<FormInput
				label="Nama Lengkap"
				name="name"
				placeholder="Masukkan nama dosen"
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

		<FormInput
			label="NIDN"
			name="nidn"
			placeholder="Masukkan NIDN (hanya angka)"
			required
			bind:value={form.nidn}
		/>

		{#if !editMode}

			<FormInput
				label="Password (opsional)"
				name="password"
				type="password"
				placeholder="Kosongkan untuk menggunakan NIDN sebagai password"
				bind:value={form.password}
			/>

		{/if}

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
				type="button"
				variant="outline"
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

				{#if editMode}

					Simpan Perubahan

				{:else}

					Tambah Dosen

				{/if}

			</Button>

		</div>

	</div>

</Modal>