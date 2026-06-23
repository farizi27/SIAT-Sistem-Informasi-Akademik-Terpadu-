CREATE TABLE `mata_kuliah` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kode` varchar(20) NOT NULL,
	`nama` varchar(150) NOT NULL,
	`sks` int NOT NULL,
	`semester` int NOT NULL,
	`prodi_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mata_kuliah_id` PRIMARY KEY(`id`),
	CONSTRAINT `mata_kuliah_kode_unique` UNIQUE(`kode`)
);
--> statement-breakpoint
ALTER TABLE `mata_kuliah` ADD CONSTRAINT `mata_kuliah_prodi_id_prodi_id_fk` FOREIGN KEY (`prodi_id`) REFERENCES `prodi`(`id`) ON DELETE no action ON UPDATE no action;