<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import SemesterForm from './SemesterForm.svelte';
	import SemesterDetail from './SemesterDetail.svelte';
	import SemesterDelete from './SemesterDelete.svelte';

	import {
		getAllSemester,
		type Semester
	} from '$lib/api/semester';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2
	} from '@lucide/svelte';

	let loading = $state(true);
	let semesters = $state<Semester[]>([]);
	let filtered = $state<Semester[]>([]);
	let keyword = $state('');
	let selected = $state<Semester | null>(null);
	let currentPage = $state(1);
	const perPage = 10;

	let showForm = $state(false);
	let showDetail = $state(false);
	let showDelete = $state(false);
	let editMode = $state(false);

	async function loadSemesters() {
		loading = true;
		try {
			const result = await getAllSemester();
			semesters = result;
			filterData();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function filterData() {
		if (!keyword.trim()) {
			filtered = semesters;
			currentPage = 1;
			return;
		}

		const key = keyword.toLowerCase();
		filtered = semesters.filter(
			(s) =>
				s.tahunAjaran.toLowerCase().includes(key) ||
				s.periode.toLowerCase().includes(key)
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

	function tambahSemester() {
		selected = null;
		editMode = false;
		showForm = true;
	}

	function editSemester(data: Semester) {
		selected = data;
		editMode = true;
		showForm = true;
	}

	function detailSemester(data: Semester) {
		selected = data;
		showDetail = true;
	}

	function hapusSemester(data: Semester) {
		selected = data;
		showDelete = true;
	}

	onMount(() => {
		loadSemesters();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Semester</h1>
			<p class="text-slate-500">Kelola seluruh data semester akademik.</p>
		</div>
		<Button onclick={tambahSemester}>
			<Plus size={18} />
			<span>Tambah Semester</span>
		</Button>
	</div>

	<!-- Search -->
	<div class="flex justify-end">
		<div class="w-full md:w-96">
			<SearchInput
				value={keyword}
				placeholder="Cari tahun ajaran atau periode..."
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
			<LoadingSpinner text="Memuat data semester..." />
		</div>
	{:else if filtered.length === 0}
		<EmptyState
			title="Data Semester belum tersedia"
			description="Silakan tambahkan data semester terlebih dahulu."
		/>
	{:else}
		<DataTable>
			<thead>
				<tr>
					<th>No</th>
					<th>Tahun Ajaran</th>
					<th>Periode</th>
					<th>Status</th>
					<th class="text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedData as item, index}
					<tr>
						<td>{(currentPage - 1) * perPage + index + 1}</td>
						<td>{item.tahunAjaran}</td>
						<td>{item.periode}</td>
						<td>
							<span
								class={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
									item.isActive
										? 'bg-green-100 text-green-700'
										: 'bg-slate-100 text-slate-600'
								}`}
							>
								{item.isActive ? 'Aktif' : 'Tidak Aktif'}
							</span>
						</td>
						<td>
							<div class="flex justify-center gap-2">
								<Button
									variant="secondary"
									size="sm"
									onclick={() => detailSemester(item)}
								>
									<Eye size={16} />
								</Button>
								<Button
									variant="warning"
									size="sm"
									onclick={() => editSemester(item)}
								>
									<Pencil size={16} />
								</Button>
								<Button
									variant="danger"
									size="sm"
									onclick={() => hapusSemester(item)}
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

	<!-- Form -->
	<SemesterForm
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
			loadSemesters();
		}}
	/>

	<!-- Detail -->
	<SemesterDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Delete -->
	<SemesterDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadSemesters();
		}}
	/>
</div>
