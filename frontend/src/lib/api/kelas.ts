import client from './client';

export interface Kelas {
	id: number;
	kodeKelas: string;
	mataKuliahId: number;
	namaMataKuliah?: string;
	kodeMataKuliah?: string;
	sks?: number;
	dosenId: number;
	namaDosen?: string;
	semesterId: number;
	tahunAjaran?: string;
	periode?: string;
	kapasitas: number;
	status: 'AKTIF' | 'NONAKTIF';
}

export interface CreateKelasRequest {
	kodeKelas: string;
	mataKuliahId: number;
	dosenId: number;
	semesterId: number;
	kapasitas: number;
}

export interface UpdateKelasRequest {
	kodeKelas?: string;
	mataKuliahId?: number;
	dosenId?: number;
	semesterId?: number;
	kapasitas?: number;
	status?: 'AKTIF' | 'NONAKTIF';
}

export const getAllKelas = async (): Promise<Kelas[]> => {
	const { data } = await client.get('/kelas');
	return data.data;
};

export const getKelasById = async (
	id: number
): Promise<Kelas> => {
	const { data } = await client.get(`/kelas/${id}`);
	return data.data;
};

export const createKelas = async (
	payload: CreateKelasRequest
) => {
	const { data } = await client.post(
		'/kelas',
		payload
	);

	return data;
};

export const updateKelas = async (
	id: number,
	payload: UpdateKelasRequest
) => {
	const { data } = await client.put(
		`/kelas/${id}`,
		payload
	);

	return data;
};

export const deleteKelas = async (
	id: number
) => {
	const { data } = await client.delete(
		`/kelas/${id}`
	);

	return data;
};