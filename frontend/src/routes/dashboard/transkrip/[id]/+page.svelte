<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getMahasiswaById, type Mahasiswa } from '$lib/api/mahasiswa';
	import { getKRSByMahasiswa, type KRS } from '$lib/api/krs';

	import Button from '$lib/components/common/Button.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import { Printer, ArrowLeft } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let loading = $state(true);
	let error = $state('');

	let mahasiswa = $state<Mahasiswa | null>(null);
	let transkripData = $state<KRS[]>([]);

	let totalSKS = $state(0);
	let ipk = $state(0);

	const gradePoints: Record<string, number> = {
		'A': 4.0,
		'B+': 3.5,
		'B': 3.0,
		'C+': 2.5,
		'C': 2.0,
		'D+': 1.5,
		'D': 1.0,
		'E': 0.0
	};

	async function loadData() {
		loading = true;
		error = '';
		try {
			const id = Number($page.params.id);
			if (isNaN(id)) throw new Error('ID Mahasiswa tidak valid');

			// Ambil profil mahasiswa
			mahasiswa = await getMahasiswaById(id);

			// Ambil semua KRS/Nilai
			const krs = await getKRSByMahasiswa(id);

			// Hanya proses mata kuliah yang sudah diberi nilai atau berstatus disetujui
			// Agar lebih akurat untuk transkrip, biasanya mata kuliah dengan nilai valid saja yang dihitung IPK
			const validKrs = krs.filter(k => k.nilai && k.nilai.trim() !== '' && gradePoints[k.nilai.toUpperCase()] !== undefined);
			
			// Jika ada mata kuliah berulang, ambil nilai yang lebih besar (optional), 
			// tapi untuk kesederhanaan, kita ambil semua yang sudah valid
			transkripData = validKrs.sort((a, b) => {
				const smtA = (a.tahunAjaran || '') + (a.periode || '');
				const smtB = (b.tahunAjaran || '') + (b.periode || '');
				return smtA.localeCompare(smtB);
			});

			calculateIPK();

		} catch (err: any) {
			console.error('[TranskripDetail] Error:', err);
			error = err.message || 'Gagal memuat data transkrip.';
		} finally {
			loading = false;
		}
	}

	function calculateIPK() {
		let totalMutu = 0;
		let sksLulus = 0;

		transkripData.forEach(item => {
			const nilaiHuruf = item.nilai?.toUpperCase() || 'E';
			const bobot = gradePoints[nilaiHuruf] ?? 0;
			const sks = item.sks ?? 0;

			// Menghitung SKS
			sksLulus += sks;
			totalMutu += (bobot * sks);
		});

		totalSKS = sksLulus;
		ipk = sksLulus > 0 ? (totalMutu / sksLulus) : 0;
	}

	function handlePrint() {
		window.print();
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>Transkrip Mahasiswa {mahasiswa ? `- ${mahasiswa.name}` : ''}</title>
</svelte:head>

<div class="space-y-6 print-container">
	<!-- Actions & Header (Hidden in Print) -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print mb-6">
		<div class="flex items-center gap-3">
			<Button
				variant="secondary"
				size="sm"
				onclick={() => goto('/dashboard/transkrip')}
			>
				<ArrowLeft size={16} />
				<span class="ml-1">Kembali</span>
			</Button>
			<div>
				<h1 class="text-2xl font-bold text-slate-800">Detail Transkrip</h1>
				<p class="text-slate-500">Lihat dan cetak transkrip nilai akademik mahasiswa.</p>
			</div>
		</div>

		{#if !loading && !error && mahasiswa}
			<Button
				variant="primary"
				onclick={handlePrint}
			>
				<Printer size={18} />
				<span class="ml-2">Cetak Transkrip</span>
			</Button>
		{/if}
	</div>

	{#if loading}
		<div class="flex justify-center py-20 no-print">
			<LoadingSpinner text="Memuat dan menghitung transkrip..." />
		</div>
	{:else if error}
		<div class="no-print">
			<EmptyState
				title="Terjadi Kesalahan"
				description={error}
			/>
		</div>
	{:else if mahasiswa}
		<!-- Printable Area -->
		<div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm print-area">
			
			<!-- Header Cetak -->
			<div class="text-center mb-10 pb-6 border-b-2 border-slate-800">
				<h1 class="text-3xl font-bold uppercase tracking-wider mb-2">Transkrip Akademik</h1>
				<p class="text-lg text-slate-600">Sistem Informasi Akademik Terpadu (SIAT)</p>
			</div>

			<!-- Info Mahasiswa -->
			<div class="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-base">
				<div>
					<table class="w-full">
						<tbody>
							<tr>
								<td class="w-32 py-1 font-semibold text-slate-600">Nama Lengkap</td>
								<td class="w-4">:</td>
								<td class="font-bold text-slate-900">{mahasiswa.name}</td>
							</tr>
							<tr>
								<td class="py-1 font-semibold text-slate-600">N I M</td>
								<td>:</td>
								<td class="font-bold text-slate-900">{mahasiswa.nim}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<table class="w-full">
						<tbody>
							<tr>
								<td class="w-32 py-1 font-semibold text-slate-600">Program Studi</td>
								<td class="w-4">:</td>
								<td class="font-bold text-slate-900">{mahasiswa.prodi}</td>
							</tr>
							<tr>
								<td class="py-1 font-semibold text-slate-600">Angkatan</td>
								<td>:</td>
								<td class="font-bold text-slate-900">{mahasiswa.angkatan}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Daftar Mata Kuliah -->
			{#if transkripData.length === 0}
				<div class="py-10 text-center border border-dashed border-slate-300 rounded-lg">
					<p class="text-slate-500">Belum ada data nilai mata kuliah yang tersimpan atau valid.</p>
				</div>
			{:else}
				<div class="mb-8">
					<table class="w-full border-collapse">
						<thead>
							<tr class="bg-slate-100 print:bg-gray-200 border-y-2 border-slate-800">
								<th class="py-3 px-4 text-left font-bold text-slate-800 w-12">No</th>
								<th class="py-3 px-4 text-left font-bold text-slate-800 w-32">Kode MK</th>
								<th class="py-3 px-4 text-left font-bold text-slate-800">Nama Mata Kuliah</th>
								<th class="py-3 px-4 text-center font-bold text-slate-800 w-24">Semester</th>
								<th class="py-3 px-4 text-center font-bold text-slate-800 w-16">SKS</th>
								<th class="py-3 px-4 text-center font-bold text-slate-800 w-16">Nilai</th>
								<th class="py-3 px-4 text-center font-bold text-slate-800 w-16">Bobot</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200">
							{#each transkripData as item, i}
								{@const bobot = gradePoints[item.nilai?.toUpperCase() || 'E']}
								<tr class="hover:bg-slate-50 print:hover:bg-transparent">
									<td class="py-3 px-4">{i + 1}</td>
									<td class="py-3 px-4 font-mono text-sm">{item.kodeMataKuliah || '-'}</td>
									<td class="py-3 px-4">{item.namaMataKuliah || '-'}</td>
									<td class="py-3 px-4 text-center text-sm">{item.tahunAjaran} / {item.periode}</td>
									<td class="py-3 px-4 text-center">{item.sks || 0}</td>
									<td class="py-3 px-4 text-center font-bold text-slate-800">{item.nilai}</td>
									<td class="py-3 px-4 text-center">{(bobot * (item.sks || 0)).toFixed(1)}</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="border-t-2 border-slate-800 bg-slate-50 print:bg-gray-100">
								<td colspan="4" class="py-4 px-4 text-right font-bold text-slate-800 uppercase">
									Total SKS Diselesaikan :
								</td>
								<td class="py-4 px-4 text-center font-bold text-xl text-blue-700 print:text-black">
									{totalSKS}
								</td>
								<td class="py-4 px-4 text-right font-bold text-slate-800 uppercase">
									I P K :
								</td>
								<td class="py-4 px-4 text-center font-bold text-xl text-blue-700 print:text-black">
									{ipk.toFixed(2)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<!-- Tanda Tangan (Khusus Print) -->
				<div class="mt-16 pt-8 flex justify-end">
					<div class="text-center w-64">
						<p class="mb-20 text-slate-800">Mengetahui,<br>Ketua Program Studi</p>
						<p class="font-bold underline text-slate-900 border-b border-slate-900 mx-4 pb-1">( ................................................. )</p>
					</div>
				</div>
			{/if}

		</div>
	{/if}
</div>

<style>
	/* CSS Print Khusus untuk Transkrip */
	@media print {
		/* Sembunyikan elemen dashboard (sidebar, navbar, notifikasi) secara global jika memungkinkan */
		:global(body *){
			visibility: hidden;
		}
		
		/* Hanya tampilkan area print */
		.print-area, .print-area * {
			visibility: visible;
		}
		
		.print-area {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			margin: 0;
			padding: 0;
			border: none;
			box-shadow: none;
		}

		/* Sembunyikan khusus tombol dan navigasi di dalam print area itu sendiri */
		.no-print {
			display: none !important;
		}
	}
</style>
