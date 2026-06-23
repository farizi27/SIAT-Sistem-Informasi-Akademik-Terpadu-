import api from './client';

export async function getDashboard() {
	const response =
		await api.get(
			'/admin/dashboard'
		);

	return response.data;
}