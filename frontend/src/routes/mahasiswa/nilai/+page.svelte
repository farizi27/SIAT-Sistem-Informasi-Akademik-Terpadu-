<script lang="ts">
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import DataTable from '$lib/components/table/DataTable.svelte';
  import { getNilai, type Nilai } from '$lib/api/mahasiswa';
  import { logActivity } from '$lib/utils/activityLog';
  import { Eye } from '@lucide/svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Swal from 'sweetalert2';

  let loading = $state(true);
  let nilaiList = $state<Nilai[]>([]);

  async function loadNilai() {
    loading = true;
    try {
      nilaiList = await getNilai();
      logActivity({ type: 'nilai', module: 'Nilai', description: 'Melihat daftar nilai mahasiswa' });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat nilai' });
    } finally {
      loading = false;
    }
  }

  onMount(loadNilai);
</script>

<style>
  .table-header { @apply bg-slate-100 text-slate-700 font-medium; }
  .table-row:hover { @apply bg-slate-50; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Daftar Nilai</h1>
  {#if loading}
    <LoadingSpinner text="Memuat nilai..." />
  {:else if nilaiList.length === 0}
    <EmptyState title="Tidak ada nilai" description="Anda belum memiliki nilai pada semester ini." />
  {:else}
    <DataTable>
      <thead class="table-header">
        <tr>
          <th class="p-2 text-left">No</th>
          <th class="p-2 text-left">Mata Kuliah</th>
          <th class="p-2 text-left">SKS</th>
          <th class="p-2 text-left">Nilai</th>
          <th class="p-2 text-left">Semester</th>
          <th class="p-2 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each nilaiList as item, i}
          <tr class="table-row border-b border-slate-200">
            <td class="p-2">{i + 1}</td>
            <td class="p-2">{item.mataKuliah}</td>
            <td class="p-2">{item.sks}</td>
            <td class="p-2">{item.nilai}</td>
            <td class="p-2">{item.semester}</td>
            <td class="p-2 text-center">
              <Button size="sm" variant="secondary" onclick={() => Swal.fire({ title: 'Detail Nilai', html: `<strong>Mata Kuliah:</strong> ${item.mataKuliah}<br><strong>Nilai:</strong> ${item.nilai}<br><strong>SKS:</strong> ${item.sks}<br><strong>Semester:</strong> ${item.semester}` })}>
                <Eye size={16} /> Lihat
              </Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </DataTable>
  {/if}
</div>
