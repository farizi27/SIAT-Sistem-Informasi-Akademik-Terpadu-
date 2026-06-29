<script lang="ts">
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import DataTable from '$lib/components/table/DataTable.svelte';
  import { getTranskrip, type TranskripItem } from '$lib/api/mahasiswa';
  import { logActivity } from '$lib/utils/activityLog';
  import Swal from 'sweetalert2';

  let loading = $state(true);
  let records = $state<TranskripItem[]>([]);

  async function loadTranskrip() {
    loading = true;
    try {
      records = await getTranskrip();
      logActivity({ type: 'status', module: 'Transkrip', description: 'Mahasiswa melihat transkrip' });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat transkrip' });
    } finally {
      loading = false;
    }
  }

  onMount(loadTranskrip);
</script>

<style>
  .table-header { @apply bg-slate-100 text-slate-700 font-medium; }
  .table-row:hover { @apply bg-slate-50; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Transkrip Akademik</h1>
  {#if loading}
    <LoadingSpinner text="Memuat transkrip..." />
  {:else if records.length === 0}
    <EmptyState title="Tidak ada data transkrip" description="Data transkrip belum tersedia." />
  {:else}
    <DataTable>
      <thead class="table-header">
        <tr>
          <th class="p-2 text-left">No</th>
          <th class="p-2 text-left">Semester</th>
          <th class="p-2 text-left">IPK</th>
        </tr>
      </thead>
      <tbody>
        {#each records as item, i}
          <tr class="table-row border-b border-slate-200">
            <td class="p-2">{i + 1}</td>
            <td class="p-2">{item.semester}</td>
            <td class="p-2">{item.ipk}</td>
          </tr>
        {/each}
      </tbody>
    </DataTable>
  {/if}
</div>
