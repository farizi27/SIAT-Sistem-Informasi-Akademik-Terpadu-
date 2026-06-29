<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/common/Button.svelte';
	import SearchInput from '$lib/components/common/SearchInput.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	import DataTable from '$lib/components/table/DataTable.svelte';

	import MahasiswaForm from './MahasiswaForm.svelte';
	import MahasiswaDetail from './MahasiswaDetail.svelte';
	import MahasiswaDelete from './MahasiswaDelete.svelte';

	import Swal from 'sweetalert2';
	import {
		getAllMahasiswa,
		resetMahasiswaPassword,
		toggleMahasiswaStatus,
		type Mahasiswa
	} from '$lib/api/mahasiswa';

	import {
		Plus,
		Eye,
		Pencil,
		Trash2,
		Key,
		Power
	} from '@lucide/svelte';

	let loading = $state(true);

	let mahasiswa = $state<Mahasiswa[]>([]);

	let filtered = $state<Mahasiswa[]>([]);

	let keyword = $state('');

	let selected = $state<Mahasiswa | null>(null);

	let currentPage = $state(1);

	const perPage = 10;

	let showForm = $state(false);

	let showDetail = $state(false);

	let showDelete = $state(false);

	let editMode = $state(false);

	async function loadMahasiswa() {

		console.log('1. loadMahasiswa dipanggil');

		loading = true;

		try {

			const result = await getAllMahasiswa();

			console.log('2. Result:', result);

			mahasiswa = result;

			filterData();

		} catch (err) {

			console.error('3. Error:', err);

		} finally {

			console.log('4. loading = false');

			loading = false;

		}

	}

	function filterData() {

		if (!keyword.trim()) {

			filtered = mahasiswa;

			currentPage = 1;

			return;

		}

		const key =
			keyword.toLowerCase();

		filtered =
			mahasiswa.filter((m) =>
				m.name
					.toLowerCase()
					.includes(key) ||

				m.email
					.toLowerCase()
					.includes(key) ||

				m.nim
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

	function tambahMahasiswa() {

		selected = null;

		editMode = false;

		showForm = true;

	}

	function editMahasiswa(
		data: Mahasiswa
	) {

		selected = data;

		editMode = true;

		showForm = true;

	}

	function detailMahasiswa(
		data: Mahasiswa
	) {

		selected = data;

		showDetail = true;

	}

	function hapusMahasiswa(
		data: Mahasiswa
	) {

		selected = data;

		showDelete = true;

	}

	async function handleResetPassword(userId: number, name: string) {
		const result = await Swal.fire({
			title: 'Reset Password?',
			text: `Apakah Anda yakin ingin me-reset password untuk ${name}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Ya, Reset',
			cancelButtonText: 'Batal'
		});

		if (result.isConfirmed) {
			try {
				await resetMahasiswaPassword(userId);
				Swal.fire('Berhasil!', 'Password berhasil direset ke NIM.', 'success');
			} catch (err: any) {
				Swal.fire('Gagal!', err?.response?.data?.message || 'Gagal me-reset password.', 'error');
			}
		}
	}

	async function handleToggleStatus(userId: number, name: string, currentStatus: boolean) {
		const actionWord = currentStatus ? 'menonaktifkan' : 'mengaktifkan';
		const result = await Swal.fire({
			title: `${actionWord.toUpperCase()} AKUN?`,
			text: `Apakah Anda yakin ingin ${actionWord} akun untuk ${name}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: `Ya, ${currentStatus ? 'Nonaktifkan' : 'Aktifkan'}`,
			cancelButtonText: 'Batal'
		});

		if (result.isConfirmed) {
			try {
				await toggleMahasiswaStatus(userId);
				Swal.fire('Berhasil!', `Status akun ${name} berhasil diubah.`, 'success');
				loadMahasiswa();
			} catch (err: any) {
				Swal.fire('Gagal!', err?.response?.data?.message || 'Gagal mengubah status akun.', 'error');
			}
		}
	}

	onMount(loadMahasiswa);
</script>

<div class="space-y-6">

	<!-- Header -->

	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

		<div>

			<h1 class="text-2xl font-bold text-slate-800">
				Manajemen Mahasiswa
			</h1>

			<p class="text-slate-500">
				Kelola seluruh data mahasiswa.
			</p>

		</div>

		<Button
			onclick={tambahMahasiswa}
		>

			<Plus size={18}></Plus>

			<span>
				Tambah Mahasiswa
			</span>

		</Button>

	</div>

	<!-- Search -->

	<div class="flex justify-end">

		<div class="w-full md:w-96">

			<SearchInput
				value={keyword}
				placeholder="Cari nama, email atau NIM..."
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
				text="Memuat data mahasiswa..."
			/>

		</div>

	{:else if filtered.length === 0}

		<EmptyState
			title="Data mahasiswa belum tersedia"
			description="Silakan tambahkan mahasiswa terlebih dahulu."
		/>

	{:else}

		<DataTable>

			<thead>

				<tr>

					<th>No</th>

					<th>NIM</th>

					<th>Nama</th>

					<th>Email</th>

					<th>Angkatan</th>

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

							{item.nim}

						</td>

						<td>

							{item.name}

						</td>

						<td>

							{item.email}

						</td>

						<td>

							{item.angkatan}

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
									onclick={() =>
										detailMahasiswa(item)}
									title="Detail"
								>

									<Eye size={16}></Eye>

								</Button>

								<Button
									variant="warning"
									size="sm"
									onclick={() =>
										editMahasiswa(item)}
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
									onclick={() =>
										hapusMahasiswa(item)}
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
		<!-- Modal Form -->

	<MahasiswaForm
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
			loadMahasiswa();
		}}
	/>

	<!-- Modal Detail -->

	<MahasiswaDetail
		open={showDetail}
		data={selected}
		onClose={() => {
			showDetail = false;
			selected = null;
		}}
	/>

	<!-- Modal Delete -->

	<MahasiswaDelete
		open={showDelete}
		data={selected}
		onClose={() => {
			showDelete = false;
			selected = null;
		}}
		onSuccess={() => {
			showDelete = false;
			selected = null;
			loadMahasiswa();
		}}
	/>

</div>