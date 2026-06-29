<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	import {
		deleteDosen,
		type Dosen
	} from '$lib/api/dosen';

	interface Props {
		open: boolean;
		data: Dosen | null;
		onClose: () => void;
		onSuccess: () => void;
	}

	let {
		open,
		data,
		onClose,
		onSuccess
	}: Props = $props();

	let loading = $state(false);

	async function handleDelete() {

		if (!data) return;

		loading = true;

		try {

			await deleteDosen(data.id);

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
	title="Hapus Dosen"
	size="sm"
	{onClose}
>

	{#if data}

		<div class="space-y-6">

			<div class="text-center">

				<div
					class="
						w-16
						h-16
						mx-auto
						rounded-full
						bg-red-100
						flex
						items-center
						justify-center
						text-red-600
						text-3xl
					"
				>
					🗑️
				</div>

				<h3
					class="
						mt-4
						text-lg
						font-semibold
						text-slate-800
					"
				>
					Hapus Dosen
				</h3>

				<p
					class="
						mt-2
						text-sm
						text-slate-500
					"
				>
					Apakah Anda yakin ingin menghapus dosen
					<strong>{data.name}</strong>?
				</p>

				<p
					class="
						mt-1
						text-xs
						text-red-500
					"
				>
					Tindakan ini tidak dapat dibatalkan.
				</p>

			</div>

			<div
				class="
					flex
					justify-end
					gap-3
					pt-4
					border-t
					border-slate-200
				"
			>

				<Button
					variant="outline"
					onclick={onClose}
				>
					Batal
				</Button>

				<Button
					variant="danger"
					loading={loading}
					onclick={handleDelete}
				>
					Hapus
				</Button>

			</div>

		</div>

	{/if}

</Modal>