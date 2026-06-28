import client from './client';

export interface KRS {
	id: number;
	mahasiswaId: number;
	kelasId: number;

	namaMahasiswa?: string;
	nim?: string;

	namaKelas?: string;
	namaMataKuliah?: string;

	sks?: number;
	semester?: string;
}

export interface CreateKRSRequest {
	mahasiswaId: number;
	kelasId: number;
}

export interface UpdateKRSRequest {
	mahasiswaId: number;
	kelasId: number;
}

export const getAllKRS = async (): Promise<KRS[]> => {
	const { data } = await client.get('/krs');
	return data.data;
};

export const getKRSById = async (
	id: number
): Promise<KRS> => {
	const { data } = await client.get(`/krs/${id}`);
	return data.data;
};

export const createKRS = async (
	payload: CreateKRSRequest
) => {
	const { data } = await client.post(
		'/krs',
		payload
	);

	return data;
};

export const updateKRS = async (
	id: number,
	payload: UpdateKRSRequest
) => {
	const { data } = await client.put(
		`/krs/${id}`,
		payload
	);

	return data;
};

export const deleteKRS = async (
	id: number
) => {
	const { data } = await client.delete(
		`/krs/${id}`
	);

	return data;
};