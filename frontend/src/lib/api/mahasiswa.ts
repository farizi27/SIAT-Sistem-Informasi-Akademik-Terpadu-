import client from './client';

export interface Mahasiswa {
	id: number;
	userId: number;
	name: string;
	email: string;
	nim: string;
	prodi: number;
	angkatan: number;
	isActive: boolean;
}

export interface CreateMahasiswaRequest {
	name: string;
	email: string;
	password: string;
	nim: string;
	prodi: number;
	angkatan: number;
}

export interface UpdateMahasiswaRequest {
	name: string;
	email: string;
	nim: string;
	prodi: number;
	angkatan: number;
}

export const getAllMahasiswa = async (): Promise<Mahasiswa[]> => {

	const response = await client.get('/admin/mahasiswa');

	console.log(response.data);

	return response.data.data;

};

export const getMahasiswaById = async (
	id: number
): Promise<Mahasiswa> => {
	const { data } = await client.get(`/admin/mahasiswa/${id}`);
	return data.data;
};

export const createMahasiswa = async (
	payload: CreateMahasiswaRequest
) => {
	const { data } = await client.post(
		'/admin/mahasiswa',
		payload
	);

	return data;
};

export const updateMahasiswa = async (
	id: number,
	payload: UpdateMahasiswaRequest
) => {
	const { data } = await client.put(
		`/admin/mahasiswa/${id}`,
		payload
	);

	return data;
};

export const deleteMahasiswa = async (
	id: number
) => {
	const { data } = await client.delete(
		`/admin/mahasiswa/${id}`
	);

	return data;
};