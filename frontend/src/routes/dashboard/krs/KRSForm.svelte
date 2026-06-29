<script lang="ts">
	import { onMount } from 'svelte';

	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';

	import {
		createKRS,
		updateKRS,
		type KRS
	} from '$lib/api/krs';

	import { getAllMahasiswa } from '$lib/api/mahasiswa';
	import { getAllKelas } from '$lib/api/kelas';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: KRS | null;
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
		mahasiswaId: '',
		kelasId: ''
	});

	let mahasiswaOptions = $state<{ label: string; value: number }[]>([]);
	let kelasOptions = $state<{ label: string; value: number }[]>([]);

	onMount(async () => {

		const [mahasiswaList, kelasList] = await Promise.all([
			getAllMahasiswa(),
			getAllKelas()
		]);

		mahasiswaOptions = mahasiswaList.map((m) => ({
			label: `${m.nim} - ${m.name}`,
			value: m.id
		}));

		kelasOptions = kelasList.map((k) => ({
			label: k.kodeKelas,
			value: k.id
		}));

	});

	function resetForm() {
		form = {
			mahasiswaId: '',
			kelasId: ''
		};
	}

	$effect(() => {

		if (!open) return;

		if (editMode && data) {

			form.mahasiswaId = String(data.mahasiswaId);
			form.kelasId = String(data.kelasId);

		} else {

			resetForm();

		}

	});

	async function submit() {

		loading = true;

		try {

			const payload = {
				mahasiswaId: Number(form.mahasiswaId),
				kelasId: Number(form.kelasId)
			};

			if (editMode && data) {

				await updateKRS(data.id, payload);

			} else {

				await createKRS(payload);

			}

			resetForm();

			onSuccess();

		} catch (err) {

			console.error('Gagal menyimpan KRS:', err);

		} finally {

			loading = false;

		}

	}
</script>

<Modal
	open={open}
	title={editMode ? 'Edit KRS' : 'Tambah KRS'}
	size="md"
	onClose={() => {
		resetForm();
		onClose();
	}}
>

	<div class="space-y-5">

		<FormSelect
			label="Mahasiswa"
			name="mahasiswaId"
			required
			options={mahasiswaOptions}
			bind:value={form.mahasiswaId}
		/>

		<FormSelect
			label="Kelas"
			name="kelasId"
			required
			options={kelasOptions}
			bind:value={form.kelasId}
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
				{editMode ? 'Simpan Perubahan' : 'Tambah KRS'}
			</Button>

		</div>

	</div>

</Modal>
