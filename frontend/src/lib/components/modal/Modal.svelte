<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	let {
		open = false,
		title = '',
		size = 'md',
		children,
		onClose
	}: {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		children?: Snippet;
		onClose: () => void;
	} = $props();

	const width = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'max-w-md';
			case 'lg':
				return 'max-w-4xl';
			case 'xl':
				return 'max-w-6xl';
			default:
				return 'max-w-2xl';
		}
	});
</script>
	<svelte:window
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		}}
	/>

{#if open}

	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">

		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
			aria-label="Tutup modal"
			onclick={onClose}
		></button>

		<!-- Modal -->
		<div
			class={`relative z-10 w-full ${width} bg-white rounded-2xl shadow-xl overflow-hidden`}
		>

			<div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">

				<h2 class="text-lg font-semibold">
					{title}
				</h2>

				<button
					type="button"
					class="p-2 rounded-lg hover:bg-slate-100"
					onclick={onClose}
				>
					<X size={20}></X>
				</button>

			</div>

			<div class="p-6">
				{@render children?.()}
			</div>

		</div>

	</div>
{/if}
	