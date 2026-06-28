import client from './client';

export interface MataKuliah {
	id: number;
	kode: string;
	nama: string;
	sks: number;
	prodiId: number;
}

export interface CreateMataKuliahRequest {
	kode: string;
	nama: string;
	sks: number;
	prodiId: number;
}

export interface UpdateMataKuliahRequest {
	kode: string;
	nama: string;
	sks: number;
	prodiId: number;
}

export const getAllMataKuliah = async (): Promise<MataKuliah[]> => {
	const { data } = await client.get('/admin/mata-kuliah');
	return data.data;
};

export const getMataKuliahById = async (
	id: number
): Promise<MataKuliah> => {
	const { data } = await client.get(`/admin/mata-kuliah/${id}`);
	return data.data;
};

export const createMataKuliah = async (
	payload: CreateMataKuliahRequest
) => {
	const { data } = await client.post(
		'/admin/mata-kuliah',
		payload
	);

	return data;
};

export const updateMataKuliah = async (
	id: number,
	payload: UpdateMataKuliahRequest
) => {
	const { data } = await client.put(
		`/admin/mata-kuliah/${id}`,
		payload
	);

	return data;
};

export const deleteMataKuliah = async (
	id: number
) => {
	const { data } = await client.delete(
		`/admin/mata-kuliah/${id}`
	);

	return data;
};