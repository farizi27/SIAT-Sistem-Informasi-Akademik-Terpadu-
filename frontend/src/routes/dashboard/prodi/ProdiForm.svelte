<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';

	import {
		createProdi,
		updateProdi,
		type Prodi
	} from '$lib/api/prodi';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: Prodi | null;
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
		nama: '',
		kode: ''
	});

	function resetForm() {

		form = {
			nama: '',
			kode: ''
		};

	}

	$effect(() => {

		if (!open) return;

		if (editMode && data) {

			form.nama = data.nama;
			form.kode = data.kode;

		} else {

			resetForm();

		}

	});

	async function submit() {

		loading = true;

		try {

			if (editMode && data) {

				await updateProdi(data.id, {
					nama: form.nama,
					kode: form.kode
				});

			} else {

				await createProdi({
					nama: form.nama,
					kode: form.kode
				});

			}

			resetForm();

			onSuccess();

		} catch (error) {

			console.error(error);

		} finally {

			loading = false;

		}

	}
</script>
<Modal
	open={open}
	title={editMode ? 'Edit Program Studi' : 'Tambah Program Studi'}
	size="md"
	onClose={() => {
		resetForm();
		onClose();
	}}
>

	<div class="space-y-5">

		<FormInput
			label="Kode Program Studi"
			name="kode"
			placeholder="Contoh: IF, SI, TI"
			required
			bind:value={form.kode}
		/>

		<FormInput
			label="Nama Program Studi"
			name="nama"
			placeholder="Contoh: Informatika"
			required
			bind:value={form.nama}
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

					Tambah Program Studi

				{/if}

			</Button>

		</div>

	</div>

</Modal>