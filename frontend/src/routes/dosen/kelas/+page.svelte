<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getKelasByDosen } from '$lib/api/dosen';
  import { user } from '$lib/stores/auth';
  import { logActivity } from '$lib/utils/activityLog';
  import { formatTimestamp } from '$lib/utils/activityLog';
  import Swal from 'sweetalert2';
  import Button from '$lib/components/common/Button.svelte';

  interface KelasInfo {
    id: number;
    kodeKelas: string;
    namaMataKuliah: string;
    semester: string;
    kapasitas: number;
    status: string;
  }

  let kelasList = $state<KelasInfo[]>([]);
  let loading = $state(false);

  async function loadKelas() {
    loading = true;
    try {
      const current = JSON.parse(localStorage.getItem('user') || '{}');
      const dosenId = current.id;
      kelasList = await getKelasByDosen(dosenId);
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat kelas' });
    } finally {
      loading = false;
    }
  }

  function viewKelas(id: number) {
    goto(`/dosen/kelas/${id}`);
  }

  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'DOSEN') goto('/login');
    loadKelas();
  });
</script>

<style>
  .table-header { @apply bg-slate-100 text-slate-700 font-medium; }
  .table-row:hover { @apply bg-slate-50; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Kelas Saya</h1>
  {#if loading}
    <p>Memuat...</p>
  {:else if kelasList.length === 0}
    <p>Tidak ada kelas.</p>
  {:else}
    <table class="w-full table-auto border-collapse">
      <thead class="table-header">
        <tr>
          <th class="p-2 text-left">Kode Kelas</th>
          <th class="p-2 text-left">Mata Kuliah</th>
          <th class="p-2 text-left">Semester</th>
          <th class="p-2 text-left">Kapasitas</th>
          <th class="p-2 text-left">Status</th>
          <th class="p-2 text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each kelasList as k (k.id)}
          <tr class="table-row border-b border-slate-200">
            <td class="p-2">{k.kodeKelas}</td>
            <td class="p-2">{k.namaMataKuliah}</td>
            <td class="p-2">{k.semester}</td>
            <td class="p-2">{k.kapasitas}</td>
            <td class="p-2">{k.status}</td>
            <td class="p-2">
              <Button type="button" size="sm" onclick={() => viewKelas(k.id)}>Lihat Mahasiswa</Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
