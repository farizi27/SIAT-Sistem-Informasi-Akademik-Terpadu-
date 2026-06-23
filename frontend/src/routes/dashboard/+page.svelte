<script lang="ts">
	import { onMount } from 'svelte';

	import StatCard
	from '$lib/components/statCard.svelte';

	import {
		getDashboard
	}
	from '$lib/api/dashboard';

	let loading =
		$state(true);

	let stats = $state({
		totalMahasiswa: 0,
		totalDosen: 0,
		totalAdmin: 0,
		totalProdi: 0,
		totalMataKuliah: 0,
		totalKelas: 0
	});

	onMount(async () => {
		try {

			const result =
				await getDashboard();

			stats =
				result.data ??
				result;

		} catch (error) {

			console.error(error);

		} finally {

			loading = false;
		}
	});
</script>

{#if loading}

	<div class="flex justify-center py-20">

		<p>
			Loading...
		</p>

	</div>

{:else}

	<div class="space-y-6">

		<div
			class="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl text-white p-8"
		>

			<h1
				class="text-3xl font-bold"
			>
				Selamat Datang 👋
			</h1>

			<p class="mt-2 opacity-90">
				Sistem Informasi Akademik Terpadu
			</p>

		</div>

		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
		>

			<StatCard
				title="Mahasiswa"
				value={stats.totalMahasiswa}
				color="blue"
			/>

			<StatCard
				title="Dosen"
				value={stats.totalDosen}
				color="green"
			/>

			<StatCard
				title="Admin"
				value={stats.totalAdmin}
				color="yellow"
			/>

			<StatCard
				title="Prodi"
				value={stats.totalProdi}
				color="purple"
			/>

			<StatCard
				title="Mata Kuliah"
				value={stats.totalMataKuliah}
				color="orange"
			/>

			<StatCard
				title="Kelas"
				value={stats.totalKelas}
				color="red"
			/>

		</div>

	</div>

{/if}