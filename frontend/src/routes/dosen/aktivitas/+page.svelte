<script lang="ts">
  import { onMount } from 'svelte';
  import { getActivities, formatTimestamp, clearActivities, type ActivityLog } from '$lib/utils/activityLog';
  import Button from '$lib/components/common/Button.svelte';
  import { goto } from '$app/navigation';

  let activities = $state<ActivityLog[]>([]);
  let loading = $state(true);

  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'DOSEN') {
      goto('/login');
    }
    activities = getActivities();
    loading = false;
  });

  function refresh() {
    activities = getActivities();
  }
  function clearAll() {
    clearActivities();
    activities = [];
  }
</script>

<style>
  .activity-card { @apply p-4 rounded-lg bg-white shadow hover:bg-slate-50 transition; }
</style>

<div class="max-w-5xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Aktivitas Dosen</h1>
  <div class="flex gap-4 mb-4">
    <Button onclick={refresh} variant="primary" size="sm">Refresh</Button>
    <Button onclick={clearAll} variant="danger" size="sm">Clear All</Button>
  </div>
  {#if loading}
    <p>Memuat aktivitas...</p>
  {:else if activities.length === 0}
    <p>Tidak ada aktivitas.</p>
  {:else}
    <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
      {#each activities as activity (activity.id)}
        <div class="activity-card flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5 h-7 w-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <!-- simple icon placeholder -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">{activity.module}</p>
            <p class="text-sm text-slate-700">{activity.description}</p>
            <p class="text-xs text-slate-400 mt-1">{formatTimestamp(activity.timestamp)} &bull; {activity.actor}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
