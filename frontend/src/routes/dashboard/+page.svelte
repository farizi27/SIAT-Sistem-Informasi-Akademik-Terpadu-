<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import { getDashboardSummary } from '$lib/api/dashboard';

	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import Card from '$lib/components/common/Card.svelte';

	import {
		Users,
		GraduationCap,
		Building2,
		BookOpen,
		School,
		Calendar,
		ClipboardList,
		FileText,
		UserPlus,
		BookPlus,
		Plus,
		ArrowRight,
		PlusCircle,
		PenLine,
		Trash2,
		Star,
		RefreshCw
	} from '@lucide/svelte';

	import { getActivities, formatTimestamp, clearActivities, type ActivityLog } from '$lib/utils/activityLog';

	const currentUser = localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user') as string)
		: null;

	const role = currentUser.role;
	const name = currentUser.name;

	let loading = $state(true);

	let summary = $state({
		mahasiswa: 0,
		dosen: 0,
		prodi: 0,
		semester: 0,
		mataKuliah: 0,
		kelas: 0,
		krs: 0
	});

	let activities = $state<ActivityLog[]>([]);

	onMount(async () => {
		try {
			summary = await getDashboardSummary();
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
		activities = getActivities();
	});

	function refreshActivities() {
		activities = getActivities();
	}

	function handleClearActivities() {
		clearActivities();
		activities = [];
	}

	const adminActions = [
		{
			title: 'Tambah Mahasiswa',
			icon: UserPlus,
			color: 'bg-blue-600',
			path: '/dashboard/mahasiswa'
		},
		{
			title: 'Tambah Dosen',
			icon: GraduationCap,
			color: 'bg-emerald-600',
			path: '/dashboard/dosen'
		},
		{
			title: 'Tambah Mata Kuliah',
			icon: BookPlus,
			color: 'bg-orange-500',
			path: '/dashboard/mata-kuliah'
		},
		{
			title: 'Tambah Kelas',
			icon: Plus,
			color: 'bg-purple-600',
			path: '/dashboard/kelas'
		}
	];
</script>

{#if loading}

	<div class="flex justify-center items-center h-[70vh]">

		<LoadingSpinner
			size="lg"
			text="Memuat Dashboard..."
		/>

	</div>

{:else}

	<div class="space-y-8">

		<!-- Welcome -->

		<div
			class="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 shadow-lg"
		>

			<h1 class="text-3xl font-bold">

				Selamat Datang, {name} 👋

			</h1>

			<p class="mt-2 text-blue-100">

				Selamat datang kembali di Sistem Informasi Akademik Terpadu.

			</p>

		</div>

		{#if role === 'ADMIN'}

			<div
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
			>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								Mahasiswa
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.mahasiswa}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

							<Users class="text-blue-600"></Users>

						</div>

					</div>

				</Card>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								Dosen
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.dosen}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

							<GraduationCap class="text-emerald-600"></GraduationCap>

						</div>

					</div>

				</Card>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								Program Studi
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.prodi}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">

							<Building2 class="text-purple-600"></Building2>

						</div>

					</div>

				</Card>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								Kelas
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.kelas}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

							<School class="text-orange-600"></School>

						</div>

					</div>

				</Card>

			</div>
						<div
				class="grid grid-cols-1 md:grid-cols-3 gap-5"
			>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								Mata Kuliah
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.mataKuliah}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center">

							<BookOpen class="text-cyan-600"></BookOpen>

						</div>

					</div>

				</Card>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								Semester
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.semester}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

							<Calendar class="text-yellow-600"></Calendar>

						</div>

					</div>

				</Card>

				<Card hover>

					<div class="flex justify-between items-center">

						<div>

							<p class="text-slate-500 text-sm">
								KRS
							</p>

							<h2 class="text-3xl font-bold mt-2">
								{summary.krs}
							</h2>

						</div>

						<div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

							<ClipboardList class="text-red-600"></ClipboardList>

						</div>

					</div>

				</Card>

			</div>

			<div class="grid lg:grid-cols-3 gap-6">

				<div class="lg:col-span-2">

					<Card
						title="Quick Action"
						subtitle="Akses cepat menu utama"
					>

						<div class="grid md:grid-cols-2 gap-4">

							{#each adminActions as action}

								{@const Icon = action.icon}

								<button
									onclick={() => goto(action.path)}
									class="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition cursor-pointer"
								>

									<div class="flex items-center gap-3">

										<div
											class={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${action.color}`}
										>

											<Icon size={20}></Icon>

										</div>

										<span class="font-medium">
											{action.title}
										</span>

									</div>

									<ArrowRight size={18}></ArrowRight>

								</button>

							{/each}

						</div>

					</Card>

				</div>

				<Card
					title="Aktivitas Terbaru"
					subtitle="Riwayat perubahan sistem"
				>
					<div class="mb-4 flex items-center justify-between">
						<span class="text-xs text-slate-400">Maks 20 entri terakhir</span>
						<div class="flex gap-2">
							<button
								onclick={refreshActivities}
								class="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 transition"
								title="Perbarui log"
							>
								<RefreshCw size={12} />
							</button>
							{#if activities.length > 0}
								<button
									onclick={handleClearActivities}
									class="rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 transition"
								>
									Bersihkan
								</button>
							{/if}
						</div>
					</div>

					{#if activities.length === 0}
						<div class="flex flex-col items-center justify-center py-8 text-slate-400">
							<ClipboardList size={36} class="mb-3 opacity-30" />
							<p class="text-sm font-medium">Belum ada aktivitas</p>
							<p class="text-xs mt-1">Aktivitas akan muncul saat data diubah</p>
						</div>
					{:else}
						<div class="space-y-3 max-h-80 overflow-y-auto pr-1">
							{#each activities as activity (activity.id)}
								{@const isCreate = activity.type === 'create'}
								{@const isUpdate = activity.type === 'update'}
								{@const isDelete = activity.type === 'delete'}
								{@const isNilai = activity.type === 'nilai'}
								<div class="flex items-start gap-3 rounded-lg p-2.5 hover:bg-slate-50 transition">
									<div class={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full
										${isCreate ? 'bg-emerald-100 text-emerald-600' : ''}
										${isUpdate ? 'bg-blue-100 text-blue-600' : ''}
										${isDelete ? 'bg-red-100 text-red-500' : ''}
										${isNilai ? 'bg-purple-100 text-purple-600' : ''}
									`}>
										{#if isCreate}<PlusCircle size={14} />
										{:else if isUpdate}<PenLine size={14} />
										{:else if isDelete}<Trash2 size={14} />
										{:else}<Star size={14} />
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">{activity.module}</p>
										<p class="text-sm text-slate-700 leading-snug">{activity.description}</p>
										<p class="text-xs text-slate-400 mt-1">{formatTimestamp(activity.timestamp)} &bull; {activity.actor}</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</Card>

			</div>

		{:else if role === 'DOSEN'}

			<div class="grid md:grid-cols-3 gap-5">

				<Card title="Kelas Diampu">

					<h2 class="text-4xl font-bold text-blue-600">
						0
					</h2>

				</Card>

				<Card title="Mahasiswa">

					<h2 class="text-4xl font-bold text-emerald-600">
						0
					</h2>

				</Card>

				<Card title="Nilai Diinput">

					<h2 class="text-4xl font-bold text-orange-600">
						0
					</h2>

				</Card>

			</div>

			<Card
				title="Informasi"
				subtitle="Dashboard Dosen"
			>

				<p class="text-slate-600">

					Selamat datang di dashboard dosen.

				</p>

			</Card>

		{:else}

			<div class="grid md:grid-cols-3 gap-5">

				<Card title="KRS">

					<h2 class="text-4xl font-bold text-blue-600">
						0
					</h2>

				</Card>

				<Card title="SKS">

					<h2 class="text-4xl font-bold text-emerald-600">
						0
					</h2>

				</Card>

				<Card title="IPK">

					<h2 class="text-4xl font-bold text-orange-600">
						0.00
					</h2>

				</Card>

			</div>

			<Card
				title="Informasi Akademik"
				subtitle="Dashboard Mahasiswa"
			>

				<p class="text-slate-600">

					Selamat datang di dashboard mahasiswa.

				</p>

			</Card>

		{/if}

	</div>

{/if}