<script lang="ts">
	import Modal from '$lib/components/modal/Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	import type { Dosen } from '$lib/api/dosen';

	interface Props {
		open: boolean;
		data: Dosen | null;
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
	title="Detail Dosen"
	size="md"
	{onClose}
>

	{#if data}

		<div class="space-y-5">

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						Nama
					</p>

					<p class="font-semibold">
						{data.name}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Email
					</p>

					<p class="font-semibold">
						{data.email}
					</p>

				</div>

			</div>

			<div class="grid grid-cols-2 gap-4">

				<div>

					<p class="text-sm text-slate-500">
						NIDN
					</p>

					<p class="font-semibold">
						{data.nidn}
					</p>

				</div>

				<div>

					<p class="text-sm text-slate-500">
						Status
					</p>

					<span
						class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
							data.isActive
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						}`}
					>

						{data.isActive ? 'Aktif' : 'Tidak Aktif'}

					</span>

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