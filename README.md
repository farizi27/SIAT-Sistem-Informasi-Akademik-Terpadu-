# 🎓 SIAT - Sistem Informasi Akademik Terpadu

SIAT (Sistem Informasi Akademik Terpadu) adalah aplikasi manajemen akademik berbasis web yang dirancang untuk membantu pengelolaan data akademik perguruan tinggi secara terintegrasi.

Aplikasi ini menyediakan fitur autentikasi, manajemen pengguna, pengelolaan data akademik, pengisian KRS, serta monitoring informasi akademik melalui dashboard yang modern dan responsif.

---

## ✨ Fitur Utama

### 🔐 Authentication & Authorization

- Login menggunakan JWT
- Role Based Access Control (RBAC)
- Get Profile
- Change Password
- Protected Routes
- Middleware Authorization

### 👨‍💼 Admin

- Dashboard Statistik
- Kelola Mahasiswa
- Kelola Dosen
- Kelola Program Studi
- Kelola Semester
- Kelola Mata Kuliah
- Kelola Kelas
- Kelola KRS

### 👨‍🎓 Mahasiswa

- Login Sistem
- Melihat Profil
- Mengubah Password
- Mengambil KRS
- Melihat Mata Kuliah yang Diambil

### 👨‍🏫 Dosen

- Login Sistem
- Melihat Profil
- Mengubah Password
- Mengelola Data Akademik

---

## 📊 Dashboard

Dashboard menampilkan informasi akademik secara ringkas:

- Total Mahasiswa
- Total Dosen
- Total Admin
- Total Program Studi
- Total Mata Kuliah
- Total Kelas

---

## 🏗️ Arsitektur Sistem

### Backend

```text
src/
│
├── config/
├── db/
│   ├── schema/
│   └── index.ts
│
├── middleware/
│   ├── verifyToken.ts
│   └── authorizeRole.ts
│
├── modules/
│   ├── auth/
│   ├── admin/
│   ├── prodi/
│   ├── semester/
│   ├── mataKuliah/
│   ├── kelas/
│   └── krs/
│
├── app.ts
└── server.ts
```

### Frontend

```text
src/
│
├── lib/
│   ├── api/
│   ├── stores/
│   └── components/
│
├── routes/
│   ├── login/
│   └── dashboard/
│
└── app.html
```

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- MySQL
- Drizzle ORM
- JWT Authentication
- bcrypt

### Frontend

- SvelteKit 2
- Svelte 5
- TypeScript
- TailwindCSS
- Axios
- SweetAlert2

---

## 🗄️ Database

### Users

| Field | Type |
|---------|---------|
| id | INT |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | ENUM |
| is_active | BOOLEAN |
| must_change_password | BOOLEAN |

### Mahasiswa

| Field | Type |
|---------|---------|
| id | INT |
| user_id | INT |
| nim | VARCHAR |
| prodi_id | INT |
| angkatan | INT |

### Dosen

| Field | Type |
|---------|---------|
| id | INT |
| user_id | INT |
| nidn | VARCHAR |

### Prodi

| Field | Type |
|---------|---------|
| id | INT |
| kode | VARCHAR |
| nama | VARCHAR |

### Semester

| Field | Type |
|---------|---------|
| id | INT |
| tahun_akademik | VARCHAR |
| semester | ENUM |
| is_active | BOOLEAN |

### Mata Kuliah

| Field | Type |
|---------|---------|
| id | INT |
| kode | VARCHAR |
| nama | VARCHAR |
| sks | INT |
| prodi_id | INT |

### Kelas

| Field | Type |
|---------|---------|
| id | INT |
| kode_kelas | VARCHAR |
| mata_kuliah_id | INT |
| dosen_id | INT |
| semester_id | INT |

### KRS

| Field | Type |
|---------|---------|
| id | INT |
| mahasiswa_id | INT |
| kelas_id | INT |

---

## 🚀 Instalasi

### Clone Repository

```bash
git clone https://github.com/USERNAME/siat.git
```

### Masuk ke Folder Backend

```bash
cd backend
```

### Install Dependency

```bash
npm install
```

### Setup Environment

Buat file `.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=siat

JWT_SECRET=your_secret_key
```

### Jalankan Backend

```bash
npm run dev
```

---

### Frontend

Masuk ke folder frontend

```bash
cd frontend
```

Install dependency

```bash
npm install
```

Jalankan aplikasi

```bash
npm run dev
```

---

## 🔑 Default Admin

```text
Email    : admin@siat.ac.id
Password : admin123
```

> Ubah password setelah login pertama kali.

---

## 📌 Roadmap

### Backend

- [x] Authentication
- [x] Authorization
- [x] CRUD Mahasiswa
- [x] CRUD Dosen
- [x] CRUD Prodi
- [x] CRUD Semester
- [x] CRUD Mata Kuliah
- [x] CRUD Kelas
- [ ] KRS
- [ ] Nilai
- [ ] Transkrip

### Frontend

- [x] Login
- [x] Dashboard
- [ ] CRUD Mahasiswa
- [ ] CRUD Dosen
- [ ] CRUD Prodi
- [ ] CRUD Semester
- [ ] CRUD Mata Kuliah
- [ ] CRUD Kelas
- [ ] CRUD KRS

---

## 👨‍💻 Developer

Developed by **[Nama Kamu]**

Project SIAT dibuat sebagai sistem informasi akademik berbasis web menggunakan Express.js, Drizzle ORM, MySQL, dan SvelteKit.

---

## 📄 License

MIT License