import client from './client';

export interface KRS {
	id: number;
	mahasiswaId: number;
	kelasId: number;

	namaMahasiswa?: string;
	nim?: string;
	namaProdi?: string;

	kodeKelas?: string;
	namaKelas?: string;
	namaMataKuliah?: string;
	kodeMataKuliah?: string;

	sks?: number;
	tahunAjaran?: string;
	periode?: string;
	semester?: string;
	
	status?: 'DRAFT' | 'DISETUJUI' | 'DITOLAK';
	nilai?: string;
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

export const getKRSByMahasiswa = async (
	mahasiswaId: number
): Promise<KRS[]> => {
	const { data } = await client.get(`/krs/mahasiswa/${mahasiswaId}`);
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

export const updateKRSStatus = async (
	id: number,
	status: 'DRAFT' | 'DISETUJUI' | 'DITOLAK'
) => {
	const { data } = await client.patch(
		`/krs/${id}/status`,
		{ status }
	);

	return data;
};

export const updateKRSGrade = async (
	id: number,
	nilai: string
) => {
	const { data } = await client.patch(
		`/krs/${id}/nilai`,
		{ nilai }
	);

	return data;
};