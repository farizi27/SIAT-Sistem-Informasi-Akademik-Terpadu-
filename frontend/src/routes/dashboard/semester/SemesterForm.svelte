<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import FormSelect from '$lib/components/form/FormSelect.svelte';

	import {
		createSemester,
		updateSemester,
		type Semester
	} from '$lib/api/semester';

	interface Props {
		open: boolean;
		editMode: boolean;
		data: Semester | null;
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
		tahunAjaran: '',
		periode: 'GANJIL',
		isActive: false
	});

	function resetForm() {
		form = {
			tahunAjaran: '',
			periode: 'GANJIL',
			isActive: false
		};
	}

	$effect(() => {
		if (!open) return;

		if (editMode && data) {
			form.tahunAjaran = data.tahunAjaran;
			form.periode = data.periode;
			form.isActive = data.isActive;
		} else {
			resetForm();
		}
	});

	async function submit() {
		loading = true;
		try {
			const payload = {
				tahunAjaran: form.tahunAjaran,
				periode: form.periode as 'GANJIL' | 'GENAP',
				isActive: form.isActive
			};

			if (editMode && data) {
				await updateSemester(data.id, payload);
			} else {
				await createSemester(payload);
			}

			resetForm();
			onSuccess();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	const periodeOptions = [
		{ label: 'GANJIL', value: 'GANJIL' },
		{ label: 'GENAP', value: 'GENAP' }
	];
</script>

<Modal
	open={open}
	title={editMode ? 'Edit Semester' : 'Tambah Semester'}
	size="md"
	onClose={() => {
		resetForm();
		onClose();
	}}
>
	<div class="space-y-5">
		<FormInput
			label="Tahun Ajaran"
			name="tahunAjaran"
			placeholder="Contoh: 2024/2025"
			required
			bind:value={form.tahunAjaran}
		/>

		<FormSelect
			label="Periode"
			name="periode"
			required
			options={periodeOptions}
			bind:value={form.periode}
		/>

		<div class="flex items-center gap-3">
			<input
				type="checkbox"
				id="isActive"
				bind:checked={form.isActive}
				class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
			/>
			<label for="isActive" class="text-sm font-medium text-slate-700 select-none">
				Set sebagai Semester Aktif (ini akan menonaktifkan semester aktif lainnya)
			</label>
		</div>

		<div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
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
				{editMode ? 'Simpan Perubahan' : 'Tambah Semester'}
			</Button>
		</div>
	</div>
</Modal>
