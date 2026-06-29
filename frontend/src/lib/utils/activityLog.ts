/**
 * Activity Log - simpan riwayat aktivitas ke localStorage
 */

export interface ActivityLog {
	id: string;
	type: 'create' | 'update' | 'delete' | 'status' | 'nilai';
	module: string;       // misal: 'Mahasiswa', 'Kelas', 'Nilai'
	description: string;  // misal: 'Data mahasiswa Budi berhasil ditambahkan'
	actor: string;        // nama user yang melakukan aksi
	timestamp: string;    // ISO string
}

const LOG_KEY = 'siat_activity_log';
const MAX_LOGS = 20;

export function logActivity(params: {
	type: ActivityLog['type'];
	module: string;
	description: string;
}) {
	const stored = localStorage.getItem('user');
	const actor = stored ? JSON.parse(stored).name : 'Sistem';

	const entry: ActivityLog = {
		id: crypto.randomUUID(),
		type: params.type,
		module: params.module,
		description: params.description,
		actor,
		timestamp: new Date().toISOString()
	};

	const existing = getActivities();
	const updated = [entry, ...existing].slice(0, MAX_LOGS);
	localStorage.setItem(LOG_KEY, JSON.stringify(updated));
}

export function getActivities(): ActivityLog[] {
	try {
		const raw = localStorage.getItem(LOG_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

export function clearActivities() {
	localStorage.removeItem(LOG_KEY);
}

export function formatTimestamp(iso: string): string {
	const date = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return 'Baru saja';
	if (diffMins < 60) return `${diffMins} menit lalu`;
	if (diffHours < 24) return `${diffHours} jam lalu`;
	if (diffDays < 7) return `${diffDays} hari lalu`;
	return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
