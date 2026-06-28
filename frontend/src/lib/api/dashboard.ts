import client from './client';

export interface DashboardSummary {
	mahasiswa: number;
	dosen: number;
	prodi: number;
	semester: number;
	mataKuliah: number;
	kelas: number;
	krs: number;
}

export interface DashboardResponse {
	data: DashboardSummary;
	message: string;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
	const { data } = await client.get<DashboardResponse>('/dashboard');

	return data.data;
};