import client from './client';

export interface Prodi {
	id: number;
	nama: string;
	kode: string;
}

export interface CreateProdiRequest {
	nama: string;
	kode: string;
}

export interface UpdateProdiRequest {
	nama: string;
	kode: string;
}

export const getAllProdi = async (): Promise<Prodi[]> => {
	const { data } = await client.get('/admin/prodi');
	return data.data;
};

export const getProdiById = async (
	id: number
): Promise<Prodi> => {
	const { data } = await client.get(`/admin/prodi/${id}`);
	return data.data;
};

export const createProdi = async (
	payload: CreateProdiRequest
) => {
	const { data } = await client.post(
		'/admin/prodi',
		payload
	);

	return data;
};

export const updateProdi = async (
	id: number,
	payload: UpdateProdiRequest
) => {
	const { data } = await client.put(
		`/admin/prodi/${id}`,
		payload
	);

	return data;
};

export const deleteProdi = async (
	id: number
) => {
	const { data } = await client.delete(
		`/admin/prodi/${id}`
	);

	return data;
};