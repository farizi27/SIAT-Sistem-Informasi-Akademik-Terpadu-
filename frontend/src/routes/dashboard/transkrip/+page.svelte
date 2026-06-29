<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import { getAllMahasiswa, type Mahasiswa } from '$lib/api/mahasiswa';
	import { FileText } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let loading = $state(true);
	let dataMahasiswa = $state<Mahasiswa[]>([]);
	let filtered = $state<Mahasiswa[]>([]);
	let keyword = $state('');
	let currentPage = $state(1);
	const perPage = 10;

	async function loadMahasiswa() {
		loading = true;
		try {
			const result = await getAllMahasiswa();
			// Hanya tampilkan mahasiswa yang aktif
			dataMahasiswa = result.filter(m => m.isActive !== false);
			filterData();
		} catch (error) {
			console.error('[TranskripIndex] Failed to load mahasiswa:', error);
		} finally {
			loading = false;
		}
	}

	function filterData() {
		if (!keyword.trim()) {
			filtered = dataMahasiswa;
			currentPage = 1;
			return;
		}

		const key = keyword.toLowerCase();
		filtered = dataMahasiswa.filter(
			(m) =>
				m.name.toLowerCase().includes(key) ||
				m.nim.toLowerCase().includes(key) ||
				String(m.prodi).toLowerCase().includes(key)
		);
		currentPage = 1;
	}

	const totalPages = $derived.by(() =>
		Math.ceil(filtered.length / perPage)
	);

	const paginatedData = $derived.by(() => {
		const start = (currentPage - 1) * perPage;
		return filtered.slice(start, start + perPage);
	});

	onMount(() => {
		loadMahasiswa();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Transkrip Mahasiswa</h1>
			<p class="text-slate-500">Pilih mahasiswa untuk melihat riwayat nilai dan transkrip akademik.</p>
		</div>
	</div>

	<!-- Search -->
	<div class="flex justify-end">
		<div class="w-full md:w-96">
			<SearchInput
				value={keyword}
				placeholder="Cari nama, NIM, atau program studi..."
				onSearch={(value) => {
					keyword = value;
					filterData();
				}}
				onClear={() => {
					keyword = '';
					filterData();
				}}
			/>
		</div>
	</div>

	<!-- Table -->
	{#if loading}
		<div class="flex justify-center py-20">
			<LoadingSpinner text="Memuat daftar mahasiswa..." />
		</div>
	{:else if filtered.length === 0}
		<EmptyState
			title="Mahasiswa Tidak Ditemukan"
			description="Tidak ada data mahasiswa yang sesuai dengan pencarian Anda."
		/>
	{:else}
		<DataTable>
			<thead>
				<tr>
					<th>No</th>
					<th>NIM</th>
					<th>Nama Lengkap</th>
					<th>Program Studi</th>
					<th>Angkatan</th>
					<th class="text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as item, index}
					<tr>
						<td>{(currentPage - 1) * perPage + index + 1}</td>
						<td class="font-medium text-slate-700">{item.nim}</td>
						<td class="font-semibold text-slate-800">{item.name}</td>
						<td>{item.prodi}</td>
						<td>{item.angkatan}</td>
						<td>
							<div class="flex justify-center">
								<Button
									variant="primary"
									size="sm"
									onclick={() => goto(`/dashboard/transkrip/${item.id}`)}
									title="Lihat Transkrip"
								>
									<FileText size={16} />
									<span class="ml-1 hidden md:inline">Lihat Transkrip</span>
								</Button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</DataTable>

		<div class="flex justify-end mt-6">
			<Pagination
				page={currentPage}
				totalPages={totalPages}
				onPageChange={(page) => {
					currentPage = page;
				}}
			/>
		</div>
	{/if}
</div>
