<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import { goto } from '$app/navigation';
  import { getActivities, formatTimestamp, type ActivityLog } from '$lib/utils/activityLog';
  import { logActivity } from '$lib/utils/activityLog';
  import Button from '$lib/components/common/Button.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let activities = $state<ActivityLog[]>([]);
  let loading = $state(true);
  let sidebarCollapsed = $state(false);

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
  }

  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'MAHASISWA') {
      goto('/login');
    }
    activities = getActivities();
    loading = false;
  });

  function refresh() {
    activities = getActivities();
  }
  function clearAll() {
    // @ts-ignore
    clearActivities();
    activities = [];
  }
</script>

<style>
  .activity-card { @apply p-4 rounded-lg bg-white shadow hover:bg-slate-50 transition; }
</style>

<div class="flex min-h-screen bg-slate-100">
  <Sidebar collapsed={sidebarCollapsed} />
  <div class="flex flex-1 flex-col">
    <Navbar onToggleSidebar={toggleSidebar} />
    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
      <!-- Mahasiswa Activity Feed (optional) -->
      {#if !loading && activities.length > 0}
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">Aktivitas Terbaru</h2>
          <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
            {#each activities as activity (activity.id)}
              <div class="activity-card flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5 h-7 w-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <!-- placeholder icon -->
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
        </div>
      {/if}
    </main>
  </div>
</div>
