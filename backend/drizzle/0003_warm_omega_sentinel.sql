CREATE TABLE `semester` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tahun_ajaran` varchar(20) NOT NULL,
	`periode` enum('GANJIL','GENAP') NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `semester_id` PRIMARY KEY(`id`)
);
