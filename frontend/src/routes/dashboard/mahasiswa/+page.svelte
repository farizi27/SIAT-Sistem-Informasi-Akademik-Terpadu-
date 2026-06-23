<script lang="ts">
	import { onMount } from 'svelte';

	import PageHeader
	from '$lib/components/PageHeader.svelte';

	import DataTable
	from '$lib/components/DataTable.svelte';

	import {
		getAllMahasiswa
	}
	from '$lib/api/mahasiswa';

	let mahasiswa =
		$state<any[]>([]);

	onMount(async () => {

		try {

			const result =
				await getAllMahasiswa();

			mahasiswa =
				result.data ??
				result;

		} catch (error) {

			console.error(error);
		}
	});
</script>

<PageHeader
	title="Mahasiswa"
	description="Kelola data mahasiswa"
	buttonText="Tambah Mahasiswa"
	onAdd={() => {
		// Handle add mahasiswa logic here
	}}
/>

<DataTable
	headers={[
		'Nama',
		'Email',
		'NIM',
		'Prodi',
		'Angkatan'
	]}
	rows={mahasiswa}
/>