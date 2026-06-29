import client from './client';

export interface Dosen {
	id: number;
	userId: number;
	name: string;
	email: string;
	nidn: string;
	isActive: boolean;
}

export interface CreateDosenRequest {
	name: string;
	email: string;
	nidn: string;
}

export interface UpdateDosenRequest {
	name: string;
	email: string;
	nidn: string;
}

export const getAllDosen = async (): Promise<Dosen[]> => {
	const { data } = await client.get('/admin/dosen');
	return data.data;
};

export const getDosenById = async (
	id: number
): Promise<Dosen> => {
	const { data } = await client.get(`/admin/dosen/${id}`);
	return data.data;
};

export const createDosen = async (
	payload: CreateDosenRequest
) => {
	const { data } = await client.post(
		'/admin/dosen',
		payload
	);

	return data;
};

export const updateDosen = async (
	id: number,
	payload: UpdateDosenRequest
) => {
	const { data } = await client.put(
		`/admin/dosen/${id}`,
		payload
	);

	return data;
};

export const deleteDosen = async (
	id: number
) => {
	const { data } = await client.delete(
		`/admin/dosen/${id}`
	);

	return data;
};