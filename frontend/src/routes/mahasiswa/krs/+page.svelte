<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/common/Button.svelte';
  import SearchInput from '$lib/components/common/SearchInput.svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import Pagination from '$lib/components/common/Pagination.svelte';
  import DataTable from '$lib/components/table/DataTable.svelte';
  import { getMyKRS, addKRS, cancelKRS, type KRS } from '$lib/api/mahasiswa';
  import { Plus, Eye, Pencil, Trash2 } from '@lucide/svelte';
  import Swal from 'sweetalert2';
  import { logActivity } from '$lib/utils/activityLog';

  let loading = $state(true);
  let krsList = $state<KRS[]>([]);
  let filtered = $state<KRS[]>([]);
  let keyword = $state('');
  let currentPage = $state(1);
  const perPage = 10;
  let showForm = $state(false);
  let selected = $state<KRS | null>(null);
  let editMode = $state(false);

  async function loadKRS() {
    loading = true;
    try {
      krsList = await getMyKRS();
      filterData();
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat KRS' });
    } finally {
      loading = false;
    }
  }

  function filterData() {
    if (!keyword.trim()) {
      filtered = krsList;
      currentPage = 1;
      return;
    }
    const key = keyword.toLowerCase();
    filtered = krsList.filter((i) =>
      (i.namaMahasiswa ?? '').toLowerCase().includes(key) ||
      (i.nim ?? '').toLowerCase().includes(key) ||
      (i.namaKelas ?? '').toLowerCase().includes(key) ||
      (i.namaMataKuliah ?? '').toLowerCase().includes(key) ||
      (i.semester ?? '').toLowerCase().includes(key)
    );
    currentPage = 1;
  }

  const totalPages = $derived(Math.ceil(filtered.length / perPage));
  const paginatedData = $derived(filtered.slice((currentPage - 1) * perPage, (currentPage - 1) * perPage + perPage));

  function tambahKRS() {
    // For simplicity we just prompt for a course ID
    Swal.fire({
      title: 'Masukkan ID mata kuliah',
      input: 'number',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await addKRS(Number(result.value));
          Swal.fire({ icon: 'success', title: 'KRS berhasil ditambahkan' });
          logActivity({ type: 'create', module: 'KRS', description: `Menambahkan KRS dengan course ID ${result.value}` });
          await loadKRS();
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Gagal menambahkan KRS' });
        }
      }
    });
  }

  function hapusKRS(item: KRS) {
    Swal.fire({
      title: 'Batalkan KRS?',
      text: `Apakah Anda yakin ingin membatalkan KRS untuk ${item.namaMataKuliah}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Batalkan',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await cancelKRS(item.id);
          Swal.fire({ icon: 'success', title: 'KRS dibatalkan' });
          logActivity({ type: 'delete', module: 'KRS', description: `Membatalkan KRS ${item.namaMataKuliah}` });
          await loadKRS();
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Gagal membatalkan KRS' });
        }
      }
    });
  }

  onMount(loadKRS);
</script>

<style>
  .table-header { @apply bg-slate-100 text-slate-700 font-medium; }
  .table-row:hover { @apply bg-slate-50; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Kartu Rencana Studi (KRS)</h1>
  {#if loading}
    <LoadingSpinner text="Memuat KRS..." />
  {:else if filtered.length === 0}
    <EmptyState title="Tidak ada KRS" description="Tambah mata kuliah melalui tombol di atas." />
  {:else}
    <DataTable>
      <thead class="table-header">
        <tr>
          <th class="p-2 text-left">No</th>
          <th class="p-2 text-left">Mata Kuliah</th>
          <th class="p-2 text-left">Kelas</th>
          <th class="p-2 text-left">SKS</th>
          <th class="p-2 text-left">Semester</th>
          <th class="p-2 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedData as item, i}
          <tr class="table-row border-b border-slate-200">
            <td class="p-2">{(currentPage - 1) * perPage + i + 1}</td>
            <td class="p-2">{item.namaMataKuliah}</td>
            <td class="p-2">{item.namaKelas}</td>
            <td class="p-2">{item.sks}</td>
            <td class="p-2">{item.semester}</td>
            <td class="p-2">
              <div class="flex justify-center gap-2">
                <Button size="sm" variant="secondary" onclick={() => {/* detail placeholder */}}>
                  <Eye size={16} />
                </Button>
                <Button size="sm" variant="danger" onclick={() => hapusKRS(item)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </DataTable>
    <div class="flex justify-end mt-4">
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={(p) => (currentPage = p)} />
    </div>
  {/if}
  <div class="mt-6 flex gap-4">
    <Button onclick={tambahKRS} variant="primary" size="sm">
      <Plus size={14} /> Tambah KRS
    </Button>
  </div>
</div>
