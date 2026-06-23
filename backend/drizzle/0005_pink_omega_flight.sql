CREATE TABLE `kelas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kode_kelas` varchar(20) NOT NULL,
	`mata_kuliah_id` int NOT NULL,
	`dosen_id` int NOT NULL,
	`semester_id` int NOT NULL,
	`kapasitas` int NOT NULL,
	`status` enum('AKTIF','NONAKTIF') NOT NULL DEFAULT 'AKTIF',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kelas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `mahasiswa` RENAME COLUMN `prodi` TO `prodi_id`;--> statement-breakpoint
ALTER TABLE `mahasiswa` MODIFY COLUMN `prodi_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_mata_kuliah_id_mata_kuliah_id_fk` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_dosen_id_dosen_id_fk` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_semester_id_semester_id_fk` FOREIGN KEY (`semester_id`) REFERENCES `semester`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_prodi_id_prodi_id_fk` FOREIGN KEY (`prodi_id`) REFERENCES `prodi`(`id`) ON DELETE no action ON UPDATE no action;