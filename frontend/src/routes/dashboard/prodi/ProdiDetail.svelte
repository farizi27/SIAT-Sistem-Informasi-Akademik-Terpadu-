<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	import type { Prodi } from '$lib/api/prodi';

	interface Props {
		open: boolean;
		data: Prodi | null;
		onClose: () => void;
	}

	let {
		open,
		data,
		onClose
	}: Props = $props();
</script>

<Modal
	open={open}
	title="Detail Program Studi"
	size="md"
	{onClose}
>

	{#if data}

		<div class="space-y-5">

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						Kode Program Studi
					</p>

					<p class="font-semibold">
						{data.kode}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Nama Program Studi
					</p>

					<p class="font-semibold">
						{data.nama}
					</p>

				</div>

			</div>

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						Dibuat Pada
					</p>

					<p class="font-semibold">
						{new Date(data.createdAt).toLocaleString('id-ID')}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Terakhir Diubah
					</p>

					<p class="font-semibold">
						{new Date(data.updatedAt).toLocaleString('id-ID')}
					</p>

				</div>

			</div>

			<div
				class="
					pt-4
					border-t
					border-slate-200
					flex
					justify-end
				"
			>

				<Button
					variant="secondary"
					onclick={onClose}
				>
					Tutup
				</Button>

			</div>

		</div>

	{/if}

</Modal>