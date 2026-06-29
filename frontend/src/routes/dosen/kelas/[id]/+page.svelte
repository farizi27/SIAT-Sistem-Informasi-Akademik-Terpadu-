<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { getMahasiswaByKelas, submitGrade } from '$lib/api/dosen';
  import { logActivity } from '$lib/utils/activityLog';
  import Swal from 'sweetalert2';
  import Button from '$lib/components/common/Button.svelte';
  import Modal from '$lib/components/modal/Modal.svelte';
  import FormInput from '$lib/components/form/FormInput.svelte';

  interface KrsRecord {
    id: number;
    mahasiswaId: number;
    namaMahasiswa: string;
    nim: string;
    nilai?: string;
  }

  let kelasId = $state<number>(0);
  let mahasiswa = $state<KrsRecord[]>([]);
  let loading = $state(false);
  // Modal state for editing a grade
  let editingRecord = $state<KrsRecord | null>(null);
  let newGrade = $state('');

  async function loadMahasiswa() {
    loading = true;
    try {
      mahasiswa = await getMahasiswaByKelas(kelasId);
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat data mahasiswa' });
    } finally {
      loading = false;
    }
  }

  function openEdit(record: KrsRecord) {
    editingRecord = { ...record };
    newGrade = record.nilai ?? '';
  }

  async function submitEdit() {
    if (!editingRecord) return;
    loading = true;
    try {
      await submitGrade(editingRecord.id, newGrade);
      Swal.fire({ icon: 'success', title: 'Nilai berhasil disimpan' });
      logActivity({
        type: 'nilai',
        module: 'Nilai Mahasiswa',
        description: `Nilai ${editingRecord.namaMahasiswa} (${editingRecord.nim}) diperbarui menjadi ${newGrade}`
      });
      // refresh list
      await loadMahasiswa();
      editingRecord = null;
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal menyimpan nilai' });
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'DOSEN') goto('/login');
    // Extract kelasId from URL params
    const unsubscribe = page.subscribe(($page) => {
      kelasId = Number($page.params.id);
    });
    loadMahasiswa();
    return () => unsubscribe();
  });
</script>

<style>
  .table-header { @apply bg-slate-100 text-slate-700 font-medium; }
  .table-row:hover { @apply bg-slate-50; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Daftar Mahasiswa Kelas {kelasId}</h1>

  {#if loading}
    <p>Memuat...</p>
  {:else if mahasiswa.length === 0}
    <p>Tidak ada mahasiswa pada kelas ini.</p>
  {:else}
    <table class="w-full table-auto border-collapse">
      <thead class="table-header">
        <tr>
          <th class="p-2 text-left">Nama</th>
          <th class="p-2 text-left">NIM</th>
          <th class="p-2 text-left">Nilai</th>
          <th class="p-2 text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each mahasiswa as m (m.id)}
          <tr class="border-b border-slate-200 table-row">
            <td class="p-2">{m.namaMahasiswa}</td>
            <td class="p-2">{m.nim}</td>
            <td class="p-2">{m.nilai ?? '-'} </td>
            <td class="p-2">
              <Button size="sm" onclick={() => openEdit(m)} variant="outline">Edit Nilai</Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  {#if editingRecord}
    <Modal open={true} title="Edit Nilai" size="sm" onClose={() => (editingRecord = null)}>
      <div class="space-y-4">
        <p><strong>Mahasiswa:</strong> {editingRecord.namaMahasiswa} ({editingRecord.nim})</p>
        <FormInput label="Nilai" bind:value={newGrade} required />
        <div class="flex justify-end gap-2 mt-2">
          <Button variant="outline" onclick={() => (editingRecord = null)} disabled={loading}>Batal</Button>
          <Button onclick={submitEdit} loading={loading}>Simpan</Button>
        </div>
      </div>
    </Modal>
  {/if}
</div>
