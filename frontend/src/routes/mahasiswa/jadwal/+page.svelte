<script lang="ts">
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import DataTable from '$lib/components/table/DataTable.svelte';
  import { getJadwal, type Jadwal } from '$lib/api/mahasiswa';
  import { logActivity } from '$lib/utils/activityLog';
  import Swal from 'sweetalert2';

  let loading = $state(true);
  let jadwalList = $state<Jadwal[]>([]);

  async function loadJadwal() {
    loading = true;
    try {
      jadwalList = await getJadwal();
      logActivity({ type: 'status', module: 'Jadwal', description: 'Mahasiswa melihat jadwal kuliah' });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat jadwal' });
    } finally {
      loading = false;
    }
  }

  onMount(loadJadwal);
</script>

<style>
  .table-header { @apply bg-slate-100 text-slate-700 font-medium; }
  .table-row:hover { @apply bg-slate-50; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Jadwal Kuliah</h1>
  {#if loading}
    <LoadingSpinner text="Memuat jadwal..." />
  {:else if jadwalList.length === 0}
    <EmptyState title="Tidak ada jadwal" description="Jadwal belum tersedia untuk semester ini." />
  {:else}
    <DataTable>
      <thead class="table-header">
        <tr>
          <th class="p-2 text-left">Hari</th>
          <th class="p-2 text-left">Mulai</th>
          <th class="p-2 text-left">Selesai</th>
          <th class="p-2 text-left">Mata Kuliah</th>
          <th class="p-2 text-left">Ruang</th>
        </tr>
      </thead>
      <tbody>
        {#each jadwalList as item}
          <tr class="table-row border-b border-slate-200">
            <td class="p-2">{item.hari}</td>
            <td class="p-2">{item.mulai}</td>
            <td class="p-2">{item.selesai}</td>
            <td class="p-2">{item.mataKuliah}</td>
            <td class="p-2">{item.ruang}</td>
          </tr>
        {/each}
      </tbody>
    </DataTable>
  {/if}
</div>
