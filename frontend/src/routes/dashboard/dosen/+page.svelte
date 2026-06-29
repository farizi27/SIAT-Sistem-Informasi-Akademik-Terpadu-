<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import DosenForm from './DosenForm.svelte';
	import DosenDetail from './DosenDetail.svelte';
	import DosenDelete from './DosenDelete.svelte';

	import Swal from 'sweetalert2';
	import {
		getAllDosen,
		resetDosenPassword,
		toggleDosenStatus,
		type Dosen
	} from '$lib/api/dosen.js';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2,
		Key,
		Power
	} from '@lucide/svelte';

	let loading = $state(true);

	let dosen = $state<Dosen[]>([]);

	let filtered = $state<Dosen[]>([]);

	let keyword = $state('');

	let selected = $state<Dosen | null>(null);

	let currentPage = $state(1);

	const perPage = 10;

	let showForm = $state(false);

	let showDetail = $state(false);

	let showDelete = $state(false);

	let editMode = $state(false);

	async function loadDosen() {

		loading = true;

		try {

			const result =
				await getAllDosen();

			dosen = result;

			filterData();

		} catch (error) {

			console.error(error);

		} finally {

			loading = false;

		}

	}

	function filterData() {

		if (!keyword.trim()) {

			filtered = dosen;

			currentPage = 1;

			return;

		}

		const key =
			keyword.toLowerCase();

		filtered =
			dosen.filter((d) =>
				d.name
					.toLowerCase()
					.includes(key) ||

				d.email
					.toLowerCase()
					.includes(key) ||

				d.nidn
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

	function tambahDosen() {

		selected = null;

		editMode = false;

		showForm = true;

	}

	function editDosen(
		data: Dosen
	) {

		selected = data;

		editMode = true;

		showForm = true;

	}

	function detailDosen(
		data: Dosen
	) {

		selected = data;

		showDetail = true;

	}

	function hapusDosen(
		data: Dosen
	) {

		selected = data;

		showDelete = true;

	}

	async function handleResetPassword(userId: number, name: string) {
		const result = await Swal.fire({
			title: 'Reset Password?',
			text: `Apakah Anda yakin ingin me-reset password untuk dosen ${name}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Ya, Reset',
			cancelButtonText: 'Batal'
		});

		if (result.isConfirmed) {
			try {
				await resetDosenPassword(userId);
				Swal.fire('Berhasil!', 'Password berhasil direset ke NIDN.', 'success');
			} catch (err: any) {
				Swal.fire('Gagal!', err?.response?.data?.message || 'Gagal me-reset password.', 'error');
			}
		}
	}

	async function handleToggleStatus(userId: number, name: string, currentStatus: boolean) {
		const actionWord = currentStatus ? 'menonaktifkan' : 'mengaktifkan';
		const result = await Swal.fire({
			title: `${actionWord.toUpperCase()} AKUN?`,
			text: `Apakah Anda yakin ingin ${actionWord} akun untuk dosen ${name}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: `Ya, ${currentStatus ? 'Nonaktifkan' : 'Aktifkan'}`,
			cancelButtonText: 'Batal'
		});

		if (result.isConfirmed) {
			try {
				await toggleDosenStatus(userId);
				Swal.fire('Berhasil!', `Status akun ${name} berhasil diubah.`, 'success');
				loadDosen();
			} catch (err: any) {
				Swal.fire('Gagal!', err?.response?.data?.message || 'Gagal mengubah status akun.', 'error');
			}
		}
	}

	onMount(() => {

		loadDosen();

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
				Manajemen Dosen
			</h1>

			<p class="text-slate-500">
				Kelola seluruh data dosen.
			</p>

		</div>

		<Button
			onclick={tambahDosen}
		>

			<Plus size={18}></Plus>

			<span>
				Tambah Dosen
			</span>

		</Button>

	</div>

	<!-- Search -->

	<div class="flex justify-end">

		<div class="w-full md:w-96">

			<SearchInput
				value={keyword}
				placeholder="Cari nama, email atau NIDN..."
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
				text="Memuat data dosen..."
			/>

		</div>

	{:else if filtered.length === 0}

		<EmptyState
			title="Data dosen belum tersedia"
			description="Silakan tambahkan dosen terlebih dahulu."
		/>

	{:else}

		<DataTable>

			<thead>

				<tr>

					<th>No</th>

					<th>NIDN</th>

					<th>Nama</th>

					<th>Email</th>

					<th>Status</th>

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

							{item.nidn}

						</td>

						<td>

							{item.name}

						</td>

						<td>

							{item.email}

						</td>

						<td>

							<span
								class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
									item.isActive
										? 'bg-green-100 text-green-700'
										: 'bg-red-100 text-red-700'
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
									onclick={() => detailDosen(item)}
									title="Detail"
								>

									<Eye size={16}></Eye>

								</Button>

								<Button
									variant="warning"
									size="sm"
									onclick={() => editDosen(item)}
									title="Edit"
								>

									<Pencil size={16}></Pencil>

								</Button>

								<Button
									variant="secondary"
									size="sm"
									onclick={() =>
										handleResetPassword(item.userId, item.name)}
									title="Reset Password"
								>

									<Key size={16}></Key>

								</Button>

								<Button
									variant={item.isActive ? "danger" : "success"}
									size="sm"
									onclick={() =>
										handleToggleStatus(item.userId, item.name, item.isActive)}
									title={item.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
								>

									<Power size={16}></Power>

								</Button>

								<Button
									variant="danger"
									size="sm"
									onclick={() => hapusDosen(item)}
									title="Hapus"
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
	<!-- Form -->

	<DosenForm
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
			loadDosen();
		}}
	/>

	<!-- Detail -->

	<DosenDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Delete -->

	<DosenDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadDosen();
		}}
	/>

</div>