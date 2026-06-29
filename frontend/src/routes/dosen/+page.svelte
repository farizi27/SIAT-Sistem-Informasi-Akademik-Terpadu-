<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/common/Button.svelte';
  import { onMount } from 'svelte';
  
  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'DOSEN') {
      goto('/login');
    }
  });
</script>

<style>
  .card { @apply bg-white rounded-xl shadow-lg p-6 text-center; }
</style>

<div class="max-w-3xl mx-auto py-12 space-y-8">
  <h1 class="text-3xl font-bold text-slate-800">Selamat Datang, Dosen</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Profil Saya</h2>
      <Button onclick={() => goto('/dosen/profile')} variant="primary" size="lg">
        Lihat Profil
      </Button>
    </div>
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Kelas Saya</h2>
      <Button onclick={() => goto('/dosen/kelas')} variant="secondary" size="lg">
        Kelola Kelas
      </Button>
    </div>
    <div class="card col-span-1 md:col-span-2">
      <h2 class="text-xl font-semibold mb-4">Aktivitas</h2>
      <Button onclick={() => goto('/dosen/aktivitas')} variant="outline" size="lg">
        Lihat Aktivitas
      </Button>
    </div>
  </div>
</div>
