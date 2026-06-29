<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';

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

	let form = $state({
		name: '',
		email: '',
		password: '',
		nidn: '',
		prodi: ''
	});

	function resetForm() {

		form = {
			name: '',
			email: '',
			password: '',
			nidn: '',
			prodi: ''
		};

	}

	$effect(() => {

		if (!open) return;

		if (editMode && data) {

			form.name = data.name;
			form.email = data.email;
			form.nidn = data.nidn;

		} else {

			resetForm();

		}

	});

	async function submit() {

	loading = true;

	try {

		if (editMode && data) {

			await updateDosen(data.id, {
				name: form.name,
				email: form.email,
				nidn: form.nidn
			});

		} else {

			console.log({
				name: form.name,
				email: form.email,
				nidn: form.nidn
			});

			const result = await createDosen({
				name: form.name,
				email: form.email,
				nidn: form.nidn
			});

			console.log(result);

		}

		onSuccess();

	} catch (err) {

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
				label="NIDN"
				name="nidn"
				placeholder="Masukkan NIDN"
				required
				bind:value={form.nidn}
			/>

		</div>

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