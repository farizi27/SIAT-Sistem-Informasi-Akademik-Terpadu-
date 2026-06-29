<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import KRSForm from './KRSForm.svelte';
	import KRSDetail from './KRSDetail.svelte';
	import KRSDelete from './KRSDelete.svelte';

	import {
		getAllKRS,
		type KRS
	} from '$lib/api/krs';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2
	} from '@lucide/svelte';

	let loading = $state(true);

	let krs = $state<KRS[]>([]);

	let filtered = $state<KRS[]>([]);

	let keyword = $state('');

	let selected = $state<KRS | null>(null);

	let currentPage = $state(1);

	const perPage = 10;

	let showForm = $state(false);

	let showDetail = $state(false);

	let showDelete = $state(false);

	let editMode = $state(false);

	async function loadKRS() {

		loading = true;

		try {

			const result = await getAllKRS();

			krs = result;

			filterData();

		} catch (err) {

			console.error('Gagal memuat data KRS:', err);

		} finally {

			loading = false;

		}

	}

	function filterData() {

		if (!keyword.trim()) {

			filtered = krs;

			currentPage = 1;

			return;

		}

		const key = keyword.toLowerCase();

		filtered = krs.filter((item) =>
			(item.namaMahasiswa ?? '').toLowerCase().includes(key) ||
			(item.nim ?? '').toLowerCase().includes(key) ||
			(item.namaKelas ?? '').toLowerCase().includes(key) ||
			(item.namaMataKuliah ?? '').toLowerCase().includes(key) ||
			(item.semester ?? '').toLowerCase().includes(key)
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

	function tambahKRS() {

		selected = null;

		editMode = false;

		showForm = true;

	}

	function editKRS(data: KRS) {

		selected = data;

		editMode = true;

		showForm = true;

	}

	function detailKRS(data: KRS) {

		selected = data;

		showDetail = true;

	}

	function hapusKRS(data: KRS) {

		selected = data;

		showDelete = true;

	}

	onMount(loadKRS);
</script>

<div class="space-y-6">

	<!-- Header -->

	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

		<div>

			<h1 class="text-2xl font-bold text-slate-800">
				Manajemen KRS
			</h1>

			<p class="text-slate-500">
				Kelola seluruh data Kartu Rencana Studi mahasiswa.
			</p>

		</div>

		<Button onclick={tambahKRS}>

			<Plus size={18}></Plus>

			<span>
				Tambah KRS
			</span>

		</Button>

	</div>

	<!-- Search -->

	<div class="flex justify-end">

		<div class="w-full md:w-96">

			<SearchInput
				value={keyword}
				placeholder="Cari nama, NIM, kelas, mata kuliah..."
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
				text="Memuat data KRS..."
			/>

		</div>

	{:else if filtered.length === 0}

		<EmptyState
			title="Data KRS belum tersedia"
			description="Silakan tambahkan KRS terlebih dahulu."
		/>

	{:else}

		<DataTable>

			<thead>

				<tr>

					<th>No</th>

					<th>Mahasiswa</th>

					<th>NIM</th>

					<th>Kelas</th>

					<th>Mata Kuliah</th>

					<th>SKS</th>

					<th>Semester</th>

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
							{item.namaMahasiswa ?? '-'}
						</td>

						<td>
							{item.nim ?? '-'}
						</td>

						<td>
							{item.namaKelas ?? '-'}
						</td>

						<td>
							{item.namaMataKuliah ?? '-'}
						</td>

						<td>
							{item.sks ?? '-'}
						</td>

						<td>
							{item.semester ?? '-'}
						</td>

						<td>

							<div class="flex justify-center gap-2">

								<Button
									variant="secondary"
									size="sm"
									onclick={() => detailKRS(item)}
								>

									<Eye size={16}></Eye>

								</Button>

								<Button
									variant="warning"
									size="sm"
									onclick={() => editKRS(item)}
								>

									<Pencil size={16}></Pencil>

								</Button>

								<Button
									variant="danger"
									size="sm"
									onclick={() => hapusKRS(item)}
								>

									<Trash2 size={16}></Trash2>

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

	<!-- Modal Form -->

	<KRSForm
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
			loadKRS();
		}}
	/>

	<!-- Modal Detail -->

	<KRSDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Modal Delete -->

	<KRSDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadKRS();
		}}
	/>

</div>
