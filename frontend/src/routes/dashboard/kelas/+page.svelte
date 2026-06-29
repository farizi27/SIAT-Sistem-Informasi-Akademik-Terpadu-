<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import KelasForm from './KelasForm.svelte';
	import KelasDetail from './KelasDetail.svelte';
	import KelasDelete from './KelasDelete.svelte';

	import {
		getAllKelas,
		type Kelas
	} from '$lib/api/kelas';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2
	} from '@lucide/svelte';

	let loading = $state(true);
	let classes = $state<Kelas[]>([]);
	let filtered = $state<Kelas[]>([]);
	let keyword = $state('');
	let selected = $state<Kelas | null>(null);
	let currentPage = $state(1);
	const perPage = 10;

	let showForm = $state(false);
	let showDetail = $state(false);
	let showDelete = $state(false);
	let editMode = $state(false);

	async function loadClasses() {
		loading = true;
		try {
			const result = await getAllKelas();
			classes = result;
			filterData();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function filterData() {
		if (!keyword.trim()) {
			filtered = classes;
			currentPage = 1;
			return;
		}

		const key = keyword.toLowerCase();
		filtered = classes.filter(
			(c) =>
				c.kodeKelas.toLowerCase().includes(key) ||
				(c.namaMataKuliah && c.namaMataKuliah.toLowerCase().includes(key)) ||
				(c.namaDosen && c.namaDosen.toLowerCase().includes(key))
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

	function tambahKelas() {
		selected = null;
		editMode = false;
		showForm = true;
	}

	function editKelas(data: Kelas) {
		selected = data;
		editMode = true;
		showForm = true;
	}

	function detailKelas(data: Kelas) {
		selected = data;
		showDetail = true;
	}

	function hapusKelas(data: Kelas) {
		selected = data;
		showDelete = true;
	}

	onMount(() => {
		loadClasses();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Kelas</h1>
			<p class="text-slate-500">Kelola seluruh data pembagian kelas akademik.</p>
		</div>
		<Button onclick={tambahKelas}>
			<Plus size={18} />
			<span>Tambah Kelas</span>
		</Button>
	</div>

	<!-- Search -->
	<div class="flex justify-end">
		<div class="w-full md:w-96">
			<SearchInput
				value={keyword}
				placeholder="Cari kode kelas, mata kuliah, atau dosen..."
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
			<LoadingSpinner text="Memuat data kelas..." />
		</div>
	{:else if filtered.length === 0}
		<EmptyState
			title="Data Kelas belum tersedia"
			description="Silakan tambahkan data kelas terlebih dahulu."
		/>
	{:else}
		<DataTable>
			<thead>
				<tr>
					<th>No</th>
					<th>Kode Kelas</th>
					<th>Mata Kuliah</th>
					<th>Dosen Pengampu</th>
					<th>Semester</th>
					<th>Kapasitas</th>
					<th>Status</th>
					<th class="text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as item, index}
					<tr>
						<td>{(currentPage - 1) * perPage + index + 1}</td>
						<td>{item.kodeKelas}</td>
						<td>{item.namaMataKuliah || '-'} ({item.kodeMataKuliah || '-'})</td>
						<td>{item.namaDosen || '-'}</td>
						<td>{item.tahunAjaran || '-'} ({item.periode || '-'})</td>
						<td>{item.kapasitas} Mahasiswa</td>
						<td>
							<span
								class={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
									item.status === 'AKTIF'
										? 'bg-green-100 text-green-700'
										: 'bg-red-100 text-red-700'
								}`}
							>
								{item.status}
							</span>
						</td>
						<td>
							<div class="flex justify-center gap-2">
								<Button
									variant="secondary"
									size="sm"
									onclick={() => detailKelas(item)}
								>
									<Eye size={16} />
								</Button>
								<Button
									variant="warning"
									size="sm"
									onclick={() => editKelas(item)}
								>
									<Pencil size={16} />
								</Button>
								<Button
									variant="danger"
									size="sm"
									onclick={() => hapusKelas(item)}
								>
									<Trash2 size={16} />
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
	<KelasForm
		open={showForm}
		editMode={editMode}
		data={selected}
		onClose={() => {
			showForm = false;
			selected = null;
			editMode = false;
		}}
		onSuccess={() => {
			showForm = false;
			selected = null;
			editMode = false;
			loadClasses();
		}}
	/>

	<!-- Detail Modal -->
	<KelasDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Delete Modal -->
	<KelasDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadClasses();
		}}
	/>
</div>
