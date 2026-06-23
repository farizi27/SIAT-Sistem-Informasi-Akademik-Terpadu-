ALTER TABLE `users` MODIFY COLUMN `is_active` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `must_change_password` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `mahasiswa` MODIFY COLUMN `prodi` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `mahasiswa` MODIFY COLUMN `angkatan` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_nidn_unique` UNIQUE(`nidn`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_nim_unique` UNIQUE(`nim`);--> statement-breakpoint
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;