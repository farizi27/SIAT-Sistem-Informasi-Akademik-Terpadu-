<script lang="ts">
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import { getIPK, getIPS } from '$lib/api/mahasiswa';
  import { logActivity } from '$lib/utils/activityLog';
  import Swal from 'sweetalert2';

  let loading = $state(true);
  let ipk = $state<number | null>(null);
  let selectedSemester = $state('');
  let ips = $state<number | null>(null);
  let semesterOptions = $state<string[]>([]);

  async function loadIPK() {
    try {
      ipk = await getIPK();
      logActivity({ type: 'status', module: 'IPK', description: 'Mahasiswa melihat IPK' });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat IPK' });
    }
  }

  async function loadIPS() {
    if (!selectedSemester) return;
    loading = true;
    try {
      ips = await getIPS(selectedSemester);
      logActivity({ type: 'status', module: 'IPS', description: `Mahasiswa melihat IPS semester ${selectedSemester}` });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat IPS' });
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await loadIPK();
    // Optionally pre‑populate semester list if API provides it; using static example for demo
    semesterOptions = ['2023/1', '2023/2', '2024/1'];
    loading = false;
  });
</script>

<style>
  .card { @apply p-6 bg-white rounded-lg shadow-md; }
</style>

<div class="max-w-3xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-6">IPK / IPS</h1>
  {#if loading}
    <LoadingSpinner text="Memuat data..." />
  {:else}
    <div class="space-y-6">
      <div class="card">
        <h2 class="text-xl font-semibold mb-2">Indeks Prestasi Kumulatif (IPK)</h2>
        {#if ipk !== null}
          <p class="text-3xl font-bold text-indigo-600">{ipk.toFixed(2)}</p>
        {:else}
          <p class="text-gray-500">Tidak ada data IPK.</p>
        {/if}
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold mb-2">Indeks Prestasi Semester (IPS)</h2>
        <div class="flex gap-4 items-center mb-4">
          <select bind:value={selectedSemester} class="border rounded p-2">
            <option value="" disabled selected>Pilih Semester</option>
            {#each semesterOptions as sem}
              <option value={sem}>{sem}</option>
            {/each}
          </select>
          <Button onclick={loadIPS} disabled={!selectedSemester}>Lihat IPS</Button>
        </div>
        {#if ips !== null}
          <p class="text-2xl font-bold text-indigo-600">{ips.toFixed(2)}</p>
        {:else if selectedSemester}
          <p class="text-gray-500">Tidak ada data IPS untuk semester {selectedSemester}.</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
