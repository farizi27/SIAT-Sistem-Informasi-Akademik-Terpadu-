// src/lib/api/mahasiswa.ts
import api from '$lib/api/client';

/* ==========================================================================
   ADMIN APIS
   ========================================================================== */

export interface Mahasiswa {
	id: number;
	userId: number;
	name: string;
	email: string;
	nim: string;
	prodi: number;
	prodiId: number;
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
	const response = await api.get('/admin/mahasiswa');
	return response.data.data;
};

export const getMahasiswaById = async (
	id: number
): Promise<Mahasiswa> => {
	const { data } = await api.get(`/admin/mahasiswa/${id}`);
	return data.data;
};

export const createMahasiswa = async (
	payload: CreateMahasiswaRequest
) => {
	const { data } = await api.post(
		'/admin/mahasiswa',
		payload
	);
	return data;
};

export const updateMahasiswa = async (
	id: number,
	payload: UpdateMahasiswaRequest
) => {
	const { data } = await api.put(
		`/admin/mahasiswa/${id}`,
		payload
	);
	return data;
};

export const deleteMahasiswa = async (
	id: number
) => {
	const { data } = await api.delete(
		`/admin/mahasiswa/${id}`
	);
	return data;
};

export const resetMahasiswaPassword = async (userId: number) => {
	const { data } = await api.post(`/admin/users/${userId}/reset-password`);
	return data;
};

export const toggleMahasiswaStatus = async (userId: number) => {
	const { data } = await api.patch(`/admin/users/${userId}/toggle-status`);
	return data;
};

/* ==========================================================================
   STUDENT PORTAL APIS
   ========================================================================== */

export interface MahasiswaProfile {
  id: number;
  name: string;
  email: string;
  nim: string;
}

/** Get logged‑in mahasiswa profile */
export async function getMahasiswaProfile(): Promise<MahasiswaProfile> {
  const res = await api.get<MahasiswaProfile>('/mahasiswa/profile');
  return res.data;
}

/** Update mahasiswa profile */
export async function updateMahasiswaProfile(payload: Partial<MahasiswaProfile>): Promise<void> {
  await api.put('/mahasiswa/profile', payload);
}

/** Change password */
export async function changeMahasiswaPassword(oldPassword: string, newPassword: string): Promise<void> {
  await api.patch('/mahasiswa/password', { oldPassword, newPassword });
}

/** KRS (Kartu Rencana Studi) */
export interface KRS {
  id: number;
  namaMahasiswa: string;
  nim: string;
  namaKelas: string;
  namaMataKuliah: string;
  sks: number;
  semester: string;
}

export async function getMyKRS(): Promise<KRS[]> {
  const res = await api.get<KRS[]>('/krs');
  return res.data;
}

export async function addKRS(courseId: number): Promise<void> {
  await api.post('/krs', { courseId });
}

export async function cancelKRS(krsId: number): Promise<void> {
  await api.delete(`/krs/${krsId}`);
}

/** Transkrip */
export interface TranskripItem {
  id: number;
  semester: string;
  ipk: number;
}
export async function getTranskrip(): Promise<TranskripItem[]> {
  const res = await api.get<TranskripItem[]>('/mahasiswa/transkrip');
  return res.data;
}

/** Nilai */
export interface Nilai {
  id: number;
  mataKuliah: string;
  sks: number;
  nilai: string;
  semester: string;
}
export async function getNilai(): Promise<Nilai[]> {
  const res = await api.get<Nilai[]>('/mahasiswa/nilai');
  return res.data;
}

/** GPA */
export async function getIPK(): Promise<number> {
  const res = await api.get<number>('/mahasiswa/ipk');
  return res.data;
}
export async function getIPS(semester: string): Promise<number> {
  const res = await api.get<number>(`/mahasiswa/ips/${semester}`);
  return res.data;
}

/** Jadwal Kuliah */
export interface Jadwal {
  id: number;
  hari: string;
  mulai: string; // HH:mm
  selesai: string; // HH:mm
  mataKuliah: string;
  ruang: string;
}
export async function getJadwal(): Promise<Jadwal[]> {
  const res = await api.get<Jadwal[]>('/mahasiswa/jadwal');
  return res.data;
}