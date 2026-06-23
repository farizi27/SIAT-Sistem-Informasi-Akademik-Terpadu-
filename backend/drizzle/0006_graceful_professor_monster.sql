CREATE TABLE `krs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mahasiswa_id` int NOT NULL,
	`kelas_id` int NOT NULL,
	`status` enum('DRAFT','DISETUJUI','DITOLAK') NOT NULL DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `krs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `krs` ADD CONSTRAINT `krs_mahasiswa_id_mahasiswa_id_fk` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `krs` ADD CONSTRAINT `krs_kelas_id_kelas_id_fk` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE no action ON UPDATE no action;