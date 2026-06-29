<script lang="ts">
  import type { Load } from '@sveltejs/kit';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import { Users, GraduationCap, BookOpen, School, Calendar, ClipboardList, Plus, ArrowRight, RefreshCw, Trash2, Star } from '@lucide/svelte';
  import { getActivities, formatTimestamp, clearActivities, type ActivityLog } from '$lib/utils/activityLog';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // Sidebar navigation for dosen role
  const dosenNav = [
    { title: 'Profil', path: '/dosen/profile', icon: Users },
    { title: 'Kelas Saya', path: '/dosen/kelas', icon: BookOpen },
    { title: 'Aktivitas', path: '/dosen/aktivitas', icon: ClipboardList }
  ];

  let activities = $state<ActivityLog[]>([]);
  let loading = $state(true);
  let sidebarCollapsed = $state(false);

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
  }

  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'DOSEN') {
      goto('/login');
    }
    activities = getActivities();
    loading = false;
  });

  function refreshActivities() {
    activities = getActivities();
  }
  function clearAllActivities() {
    clearActivities();
    activities = [];
  }
</script>

<style>
  .sidebar-nav {
    @apply flex flex-col gap-2;
  }
</style>

<div class="flex min-h-screen bg-slate-100">
  <Sidebar collapsed={sidebarCollapsed} />
  <div class="flex flex-1 flex-col">
    <Navbar onToggleSidebar={toggleSidebar} />
    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}

      <!-- Activity Feed (optional, can be placed on a dedicated page) -->
      {#if !loading && activities.length > 0}
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">Aktivitas Terbaru</h2>
          <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
            {#each activities as activity (activity.id)}
              {@const isCreate = activity.type === 'create'}
              {@const isUpdate = activity.type === 'update'}
              {@const isDelete = activity.type === 'delete'}
              {@const isNilai = activity.type === 'nilai'}
              <div class="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition">
                <div class={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full
                  ${isCreate ? 'bg-emerald-100 text-emerald-600' : ''}
                  ${isUpdate ? 'bg-blue-100 text-blue-600' : ''}
                  ${isDelete ? 'bg-red-100 text-red-500' : ''}
                  ${isNilai ? 'bg-purple-100 text-purple-600' : ''}`}
                >
                  {#if isCreate}<Plus size={14} />
                  {:else if isUpdate}<RefreshCw size={14} />
                  {:else if isDelete}<Trash2 size={14} />
                  {:else}<Star size={14} />
                  {/if}
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
