<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import NilaiForm from './NilaiForm.svelte';

	import {
		getAllKRS,
		type KRS
	} from '$lib/api/krs';

	import {
		Pencil
	} from '@lucide/svelte';

	let loading = $state(true);
	let dataKrs = $state<KRS[]>([]);
	let filtered = $state<KRS[]>([]);
	let keyword = $state('');
	let selected = $state<KRS | null>(null);
	let currentPage = $state(1);
	const perPage = 10;

	let showForm = $state(false);

	async function loadKRS() {
		loading = true;
		try {
			const result = await getAllKRS();
			// Hanya tampilkan yang disetujui (opsional, tapi karena admin, tampilkan semua juga bisa)
			dataKrs = result;
			filterData();
		} catch (error) {
			console.error('[NilaiPage] Failed to load KRS:', error);
		} finally {
			loading = false;
		}
	}

	function filterData() {
		if (!keyword.trim()) {
			filtered = dataKrs;
			currentPage = 1;
			return;
		}

		const key = keyword.toLowerCase();
		filtered = dataKrs.filter(
			(c) =>
				(c.namaMahasiswa && c.namaMahasiswa.toLowerCase().includes(key)) ||
				(c.nim && c.nim.toLowerCase().includes(key)) ||
				(c.namaMataKuliah && c.namaMataKuliah.toLowerCase().includes(key)) ||
				(c.kodeKelas && c.kodeKelas.toLowerCase().includes(key))
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

	function ubahNilai(data: KRS) {
		selected = data;
		showForm = true;
	}

	onMount(() => {
		loadKRS();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Nilai (KRS)</h1>
			<p class="text-slate-500">Lihat dan ubah nilai mahasiswa berdasarkan Kartu Rencana Studi.</p>
		</div>
		<!-- Tidak ada tombol tambah nilai, sesuai kebutuhan spesifik ini -->
	</div>

	<!-- Search -->
	<div class="flex justify-end">
		<div class="w-full md:w-96">
			<SearchInput
				value={keyword}
				placeholder="Cari nama mahasiswa, NIM, atau mata kuliah..."
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
			<LoadingSpinner text="Memuat data nilai..." />
		</div>
	{:else if filtered.length === 0}
		<EmptyState
			title="Data Nilai belum tersedia"
			description="Belum ada data KRS atau entri nilai yang ditemukan."
		/>
	{:else}
		<DataTable>
			<thead>
				<tr>
					<th>No</th>
					<th>Mahasiswa (NIM)</th>
					<th>Mata Kuliah (Kelas)</th>
					<th>Semester</th>
					<th>Status KRS</th>
					<th class="text-center">Nilai</th>
					<th class="text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as item, index}
					<tr>
						<td>{(currentPage - 1) * perPage + index + 1}</td>
						<td>
							<div class="flex flex-col">
								<span class="font-medium text-slate-800">{item.namaMahasiswa || '-'}</span>
								<span class="text-xs text-slate-500">{item.nim || '-'}</span>
							</div>
						</td>
						<td>
							<div class="flex flex-col">
								<span class="font-medium text-slate-800">{item.namaMataKuliah || '-'}</span>
								<span class="text-xs text-slate-500">
									Kelas {item.kodeKelas || '-'} ({item.sks || 0} SKS)
								</span>
							</div>
						</td>
						<td>{item.tahunAjaran || '-'} ({item.periode || '-'})</td>
						<td>
							<span
								class={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
									item.status === 'DISETUJUI'
										? 'bg-green-100 text-green-700'
										: item.status === 'DITOLAK'
										? 'bg-red-100 text-red-700'
										: 'bg-yellow-100 text-yellow-700'
								}`}
							>
								{item.status || '-'}
							</span>
						</td>
						<td class="text-center">
							{#if item.nilai}
								<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
									{item.nilai}
								</span>
							{:else}
								<span class="text-slate-400 italic text-sm">Kosong</span>
							{/if}
						</td>
						<td>
							<div class="flex justify-center gap-2">
								<Button
									variant="secondary"
									size="sm"
									onclick={() => ubahNilai(item)}
									title="Ubah Nilai"
								>
									<Pencil size={16} />
									<span class="ml-1 hidden md:inline">Ubah Nilai</span>
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

	<!-- Form Modal -->
	<NilaiForm
		open={showForm}
		data={selected}
		onClose={() => {
			showForm = false;
			selected = null;
		}}
		onSuccess={() => {
			showForm = false;
			selected = null;
			loadKRS();
		}}
	/>
</div>
