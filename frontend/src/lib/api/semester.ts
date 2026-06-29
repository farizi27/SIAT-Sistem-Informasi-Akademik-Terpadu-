import client from './client';

export interface Semester {
	id: number;
	tahunAjaran: string;
	periode: 'GANJIL' | 'GENAP';
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateSemesterRequest {
	tahunAjaran: string;
	periode: 'GANJIL' | 'GENAP';
	isActive: boolean;
}

export interface UpdateSemesterRequest {
	tahunAjaran?: string;
	periode?: 'GANJIL' | 'GENAP';
	isActive?: boolean;
}

export const getAllSemester = async (): Promise<Semester[]> => {
	const { data } = await client.get('/semester');
	return data.data;
};

export const getSemesterById = async (
	id: number
): Promise<Semester> => {
	const { data } = await client.get(`/semester/${id}`);
	return data.data;
};

export const createSemester = async (
	payload: CreateSemesterRequest
) => {
	const { data } = await client.post(
		'/semester',
		payload
	);

	return data;
};

export const updateSemester = async (
	id: number,
	payload: UpdateSemesterRequest
) => {
	const { data } = await client.put(
		`/semester/${id}`,
		payload
	);

	return data;
};

export const deleteSemester = async (
	id: number
) => {
	const { data } = await client.delete(
		`/semester/${id}`
	);

	return data;
};