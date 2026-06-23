CREATE TABLE `dosen` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`nidn` varchar(20) NOT NULL,
	CONSTRAINT `dosen_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('ADMIN','DOSEN','MAHASISWA') NOT NULL,
	`is_active` boolean DEFAULT true,
	`must_change_password` boolean DEFAULT true,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mahasiswa` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`nim` varchar(20) NOT NULL,
	`prodi` varchar(100),
	`angkatan` int,
	CONSTRAINT `mahasiswa_id` PRIMARY KEY(`id`)
);
