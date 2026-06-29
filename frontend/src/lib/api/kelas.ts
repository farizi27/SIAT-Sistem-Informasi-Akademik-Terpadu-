import client from './client';

export interface Kelas {
	id: number;
	kodeKelas: string;
	mataKuliahId: number;
	dosenId: number;
	semesterId: number;
	kapasitas: number;
	status: string;
}

export interface CreateKelasRequest {
	nama: string;
	mataKuliahId: number;
	dosenId: number;
	semesterId: number;
}

export interface UpdateKelasRequest {
	nama: string;
	mataKuliahId: number;
	dosenId: number;
	semesterId: number;
}

export const getAllKelas = async (): Promise<Kelas[]> => {
	const { data } = await client.get('/admin/kelas');
	return data.data;
};

export const getKelasById = async (
	id: number
): Promise<Kelas> => {
	const { data } = await client.get(`/admin/kelas/${id}`);
	return data.data;
};

export const createKelas = async (
	payload: CreateKelasRequest
) => {
	const { data } = await client.post(
		'/admin/kelas',
		payload
	);

	return data;
};

export const updateKelas = async (
	id: number,
	payload: UpdateKelasRequest
) => {
	const { data } = await client.put(
		`/admin/kelas/${id}`,
		payload
	);

	return data;
};

export const deleteKelas = async (
	id: number
) => {
	const { data } = await client.delete(
		`/admin/kelas/${id}`
	);

	return data;
};