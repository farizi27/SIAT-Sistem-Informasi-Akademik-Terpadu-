import client from './client';

export interface Semester {
	id: number;
	nama: string;
	tahunAjaran: string;
	isActive: boolean;
}

export interface CreateSemesterRequest {
	nama: string;
	tahunAjaran: string;
	isActive: boolean;
}

export interface UpdateSemesterRequest {
	nama: string;
	tahunAjaran: string;
	isActive: boolean;
}

export const getAllSemester = async (): Promise<Semester[]> => {
	const { data } = await client.get('/admin/semester');
	return data.data;
};

export const getSemesterById = async (
	id: number
): Promise<Semester> => {
	const { data } = await client.get(`/admin/semester/${id}`);
	return data.data;
};

export const createSemester = async (
	payload: CreateSemesterRequest
) => {
	const { data } = await client.post(
		'/admin/semester',
		payload
	);

	return data;
};

export const updateSemester = async (
	id: number,
	payload: UpdateSemesterRequest
) => {
	const { data } = await client.put(
		`/admin/semester/${id}`,
		payload
	);

	return data;
};

export const deleteSemester = async (
	id: number
) => {
	const { data } = await client.delete(
		`/admin/semester/${id}`
	);

	return data;
};