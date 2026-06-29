<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import ProdiForm from './ProdiForm.svelte';
	import ProdiDetail from './ProdiDetail.svelte';
	import ProdiDelete from './ProdiDelete.svelte';

	import {
		getAllProdi,
		type Prodi
	} from '$lib/api/prodi';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2
	} from '@lucide/svelte';

	let loading = $state(true);

	let prodi = $state<Prodi[]>([]);

	let filtered = $state<Prodi[]>([]);

	let keyword = $state('');

	let selected = $state<Prodi | null>(null);

	let currentPage = $state(1);

	const perPage = 10;

	let showForm = $state(false);

	let showDetail = $state(false);

	let showDelete = $state(false);

	let editMode = $state(false);

	async function loadProdi() {

		loading = true;

		try {

			const result =
				await getAllProdi();

			prodi = result;

			filterData();

		} catch (error) {

			console.error(error);

		} finally {

			loading = false;

		}

	}

	function filterData() {

		if (!keyword.trim()) {

			filtered = prodi;

			currentPage = 1;

			return;

		}

		const key =
			keyword.toLowerCase();

		filtered =
			prodi.filter((p) =>
				p.kode
					.toLowerCase()
					.includes(key) ||

				p.nama
					.toLowerCase()
					.includes(key)
			);

		currentPage = 1;

	}

	const totalPages = $derived.by(() =>
		Math.ceil(filtered.length / perPage)
	);

	const paginatedData = $derived.by(() => {

		const start =
			(currentPage - 1) * perPage;

		return filtered.slice(
			start,
			start + perPage
		);

	});

	function tambahProdi() {

		selected = null;

		editMode = false;

		showForm = true;

	}

	function editProdi(
		data: Prodi
	) {

		selected = data;

		editMode = true;

		showForm = true;

	}

	function detailProdi(
		data: Prodi
	) {

		selected = data;

		showDetail = true;

	}

	function hapusProdi(
		data: Prodi
	) {

		selected = data;

		showDelete = true;

	}

	onMount(() => {

		loadProdi();

	});
</script>
<div class="space-y-6">

	<!-- Header -->

	<div
		class="
			flex
			flex-col
			gap-4
			md:flex-row
			md:items-center
			md:justify-between
		"
	>

		<div>

			<h1 class="text-2xl font-bold text-slate-800">
				Manajemen Program Studi
			</h1>

			<p class="text-slate-500">
				Kelola seluruh data program studi.
			</p>

		</div>

		<Button
			onclick={tambahProdi}
		>

			<Plus size={18} />

			<span>
				Tambah Program Studi
			</span>

		</Button>

	</div>

	<!-- Search -->

	<div class="flex justify-end">

		<div class="w-full md:w-96">

			<SearchInput
				value={keyword}
				placeholder="Cari kode atau nama program studi..."
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

			<LoadingSpinner
				text="Memuat data program studi..."
			/>

		</div>

	{:else if filtered.length === 0}

		<EmptyState
			title="Data Program Studi belum tersedia"
			description="Silakan tambahkan program studi terlebih dahulu."
		/>

	{:else}

		<DataTable>

			<thead>

				<tr>

					<th>No</th>

					<th>Kode</th>

					<th>Nama Program Studi</th>

					<th class="text-center">
						Aksi
					</th>

				</tr>

			</thead>

			<tbody>

				{#each paginatedData as item, index}

					<tr>

						<td>

							{(currentPage - 1) * perPage + index + 1}

						</td>

						<td>

							{item.kode}

						</td>

						<td>

							{item.nama}

						</td>

						<td>

							<div class="flex justify-center gap-2">

								<Button
									variant="secondary"
									size="sm"
									onclick={() => detailProdi(item)}
								>

									<Eye size={16} />

								</Button>

								<Button
									variant="warning"
									size="sm"
									onclick={() => editProdi(item)}
								>

									<Pencil size={16} />

								</Button>

								<Button
									variant="danger"
									size="sm"
									onclick={() => hapusProdi(item)}
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

	<ProdiForm
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
			loadProdi();
		}}
	/>

	<!-- Detail -->

	<ProdiDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Delete -->

	<ProdiDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadProdi();
		}}
	/>

</div>