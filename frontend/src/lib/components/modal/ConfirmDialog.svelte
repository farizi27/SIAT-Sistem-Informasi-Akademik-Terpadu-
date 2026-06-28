<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let {
		open = false,
		title = 'Konfirmasi',
		message = 'Apakah Anda yakin?',
		confirmText = 'Ya',
		cancelText = 'Batal',
		loading = false,
		onConfirm,
		onCancel
	}: {
		open?: boolean;
		title?: string;
		message?: string;
		confirmText?: string;
		cancelText?: string;
		loading?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	} = $props();
</script>

<Modal
	{open}
	{title}
	size="sm"
	onClose={onCancel}
>

	<div class="space-y-6">

		<p class="text-slate-600">
			{message}
		</p>

		<div class="flex justify-end gap-3">

			<Button
				variant="outline"
				onclick={onCancel}
			>
				{cancelText}
			</Button>

			<Button
				variant="danger"
				loading={loading}
				onclick={onConfirm}
			>
				{confirmText}
			</Button>

		</div>

	</div>

</Modal>