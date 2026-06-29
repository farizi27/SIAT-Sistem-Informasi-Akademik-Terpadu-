import client from './client';

export interface Prodi {
	id: number;
	nama: string;
	kode: string;
	createdAt: string;
	updatedAt: string;
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
	const { data } = await client.get('/prodi');
	return data.data;
};

export const getProdiById = async (
	id: number
): Promise<Prodi> => {
	const { data } = await client.get(`/prodi/${id}`);
	return data.data;
};

export const createProdi = async (
	payload: CreateProdiRequest
) => {
	const { data } = await client.post(
		'/prodi',
		payload
	);

	return data;
};

export const updateProdi = async (
	id: number,
	payload: UpdateProdiRequest
) => {
	const { data } = await client.put(
		`/prodi/${id}`,
		payload
	);

	return data;
};

export const deleteProdi = async (
	id: number
) => {
	const { data } = await client.delete(
		`/prodi/${id}`
	);

	return data;
};