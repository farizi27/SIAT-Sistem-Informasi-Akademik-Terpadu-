CREATE TABLE `prodi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kode` varchar(20) NOT NULL,
	`nama` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prodi_id` PRIMARY KEY(`id`),
	CONSTRAINT `prodi_kode_unique` UNIQUE(`kode`)
);
