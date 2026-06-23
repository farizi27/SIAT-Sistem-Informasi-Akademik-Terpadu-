import api from './client';

export async function getAllMahasiswa() {
	const response =
		await api.get(
			'/admin/mahasiswa'
		);

	return response.data;
}