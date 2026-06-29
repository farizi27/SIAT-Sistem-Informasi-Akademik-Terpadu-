import client from './client';

export interface MataKuliah {
	id: number;
	kode: string;
	nama: string;
	sks: number;
	semester: number;
	prodiId: number;
	namaProdi?: string;
}

export interface CreateMataKuliahRequest {
	kode: string;
	nama: string;
	sks: number;
	semester: number;
	prodiId: number;
}

export interface UpdateMataKuliahRequest {
	kode: string;
	nama: string;
	sks: number;
	semester: number;
	prodiId: number;
}

export const getAllMataKuliah = async (): Promise<MataKuliah[]> => {
	const { data } = await client.get('/mata-kuliah');
	return data.data;
};

export const getMataKuliahById = async (
	id: number
): Promise<MataKuliah> => {
	const { data } = await client.get(`/mata-kuliah/${id}`);
	return data.data;
};

export const createMataKuliah = async (
	payload: CreateMataKuliahRequest
) => {
	const { data } = await client.post(
		'/mata-kuliah',
		payload
	);

	return data;
};

export const updateMataKuliah = async (
	id: number,
	payload: UpdateMataKuliahRequest
) => {
	const { data } = await client.put(
		`/mata-kuliah/${id}`,
		payload
	);

	return data;
};

export const deleteMataKuliah = async (
	id: number
) => {
	const { data } = await client.delete(
		`/mata-kuliah/${id}`
	);

	return data;
};