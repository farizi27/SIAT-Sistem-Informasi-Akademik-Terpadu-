<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import MataKuliahForm from './MataKuliahForm.svelte';
	import MataKuliahDetail from './MataKuliahDetail.svelte';
	import MataKuliahDelete from './MataKuliahDelete.svelte';

	import {
		getAllMataKuliah,
		type MataKuliah
	} from '$lib/api/mataKuliah';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2
	} from '@lucide/svelte';

	let loading = $state(true);
	let courses = $state<MataKuliah[]>([]);
	let filtered = $state<MataKuliah[]>([]);
	let keyword = $state('');
	let selected = $state<MataKuliah | null>(null);
	let currentPage = $state(1);
	const perPage = 10;

	let showForm = $state(false);
	let showDetail = $state(false);
	let showDelete = $state(false);
	let editMode = $state(false);

	async function loadCourses() {
		loading = true;
		try {
			const result = await getAllMataKuliah();
			courses = result;
			filterData();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function filterData() {
		if (!keyword.trim()) {
			filtered = courses;
			currentPage = 1;
			return;
		}

		const key = keyword.toLowerCase();
		filtered = courses.filter(
			(c) =>
				c.kode.toLowerCase().includes(key) ||
				c.nama.toLowerCase().includes(key) ||
				(c.namaProdi && c.namaProdi.toLowerCase().includes(key))
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

	function tambahCourse() {
		selected = null;
		editMode = false;
		showForm = true;
	}

	function editCourse(data: MataKuliah) {
		selected = data;
		editMode = true;
		showForm = true;
	}

	function detailCourse(data: MataKuliah) {
		selected = data;
		showDetail = true;
	}

	function hapusCourse(data: MataKuliah) {
		selected = data;
		showDelete = true;
	}

	onMount(() => {
		loadCourses();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Mata Kuliah</h1>
			<p class="text-slate-500">Kelola kurikulum dan data mata kuliah universitas.</p>
		</div>
		<Button onclick={tambahCourse}>
			<Plus size={18} />
			<span>Tambah Mata Kuliah</span>
		</Button>
	</div>

	<!-- Search -->
	<div class="flex justify-end">
		<div class="w-full md:w-96">
			<SearchInput
				value={keyword}
				placeholder="Cari kode, nama mata kuliah, atau prodi..."
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
			<LoadingSpinner text="Memuat data mata kuliah..." />
		</div>
	{:else if filtered.length === 0}
		<EmptyState
			title="Data Mata Kuliah belum tersedia"
			description="Silakan tambahkan data mata kuliah terlebih dahulu."
		/>
	{:else}
		<DataTable>
			<thead>
				<tr>
					<th>No</th>
					<th>Kode</th>
					<th>Nama Mata Kuliah</th>
					<th>SKS</th>
					<th>Semester</th>
					<th>Program Studi</th>
					<th class="text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as item, index}
					<tr>
						<td>{(currentPage - 1) * perPage + index + 1}</td>
						<td>{item.kode}</td>
						<td>{item.nama}</td>
						<td>{item.sks} SKS</td>
						<td>Semester {item.semester}</td>
						<td>{item.namaProdi || '-'}</td>
						<td>
							<div class="flex justify-center gap-2">
								<Button
									variant="secondary"
									size="sm"
									onclick={() => detailCourse(item)}
								>
									<Eye size={16} />
								</Button>
								<Button
									variant="warning"
									size="sm"
									onclick={() => editCourse(item)}
								>
									<Pencil size={16} />
								</Button>
								<Button
									variant="danger"
									size="sm"
									onclick={() => hapusCourse(item)}
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
	<MataKuliahForm
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
			loadCourses();
		}}
	/>

	<!-- Detail Modal -->
	<MataKuliahDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Delete Modal -->
	<MataKuliahDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadCourses();
		}}
	/>
</div>
