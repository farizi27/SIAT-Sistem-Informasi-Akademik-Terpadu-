// src/lib/api/dosen.ts
import api from '$lib/api/client';

/* ==========================================================================
   ADMIN APIS
   ========================================================================== */

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
	password?: string;
}

export interface UpdateDosenRequest {
	name: string;
	email: string;
	nidn: string;
}

export const getAllDosen = async (): Promise<Dosen[]> => {
	const { data } = await api.get('/admin/dosen');
	return data.data;
};

export const getDosenById = async (
	id: number
): Promise<Dosen> => {
	const { data } = await api.get(`/admin/dosen/${id}`);
	return data.data;
};

export const createDosen = async (
	payload: CreateDosenRequest
) => {
	const { data } = await api.post(
		'/admin/dosen',
		payload
	);
	return data;
};

export const updateDosen = async (
	id: number,
	payload: UpdateDosenRequest
) => {
	const { data } = await api.put(
		`/admin/dosen/${id}`,
		payload
	);
	return data;
};

export const deleteDosen = async (
	id: number
) => {
	const { data } = await api.delete(
		`/admin/dosen/${id}`
	);
	return data;
};

export const resetDosenPassword = async (userId: number) => {
	const { data } = await api.post(`/admin/users/${userId}/reset-password`);
	return data;
};

export const toggleDosenStatus = async (userId: number) => {
	const { data } = await api.patch(`/admin/users/${userId}/toggle-status`);
	return data;
};

/* ==========================================================================
   DOSEN PORTAL APIS
   ========================================================================== */

export interface DosenProfile {
  id: number;
  name: string;
  email: string;
  nip: string;
}

/** Get logged‑in dosen profile */
export async function getDosenProfile(): Promise<DosenProfile> {
  const res = await api.get<DosenProfile>('/dosen/profile');
  return res.data;
}

/** Update dosen profile */
export async function updateDosenProfile(payload: Partial<DosenProfile>): Promise<void> {
  await api.put('/dosen/profile', payload);
}

/** Change password */
export async function changeDosenPassword(oldPassword: string, newPassword: string): Promise<void> {
  await api.patch('/dosen/password', { oldPassword, newPassword });
}

/** Get classes taught by the dosen */
export interface KelasInfo {
  id: number;
  kodeKelas: string;
  namaMataKuliah: string;
  semester: string;
  kapasitas: number;
  status: string;
}
export async function getKelasByDosen(dosenId: number): Promise<KelasInfo[]> {
  const res = await api.get<KelasInfo[]>(`/dosen/${dosenId}/kelas`);
  return res.data;
}

/** Get students (KRS records) for a class */
export interface KrsRecord {
  id: number;
  mahasiswaId: number;
  namaMahasiswa: string;
  nim: string;
  nilai?: string;
}
export async function getMahasiswaByKelas(kelasId: number): Promise<KrsRecord[]> {
  const res = await api.get<KrsRecord[]>(`/kelas/${kelasId}/mahasiswa`);
  return res.data;
}

/** Submit or update a grade for a KRS record */
export async function submitGrade(krsId: number, nilai: string): Promise<void> {
  await api.put(`/krs/${krsId}/grade`, { nilai });
}