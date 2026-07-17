PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_music` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text DEFAULT 'Tachyon' NOT NULL,
	`description` text,
	`uploaded_at` integer NOT NULL,
	`bpm` integer,
	`style` text,
	`setup` text,
	`tags` text,
	`audio_file` text
);
--> statement-breakpoint
INSERT INTO `__new_music`("id", "title", "author", "description", "uploaded_at", "bpm", "style", "setup", "tags", "audio_file") SELECT "id", "title", "author", "description", "uploaded_at", "bpm", "style", "setup", "tags", "audio_file" FROM `music`;--> statement-breakpoint
DROP TABLE `music`;--> statement-breakpoint
ALTER TABLE `__new_music` RENAME TO `music`;--> statement-breakpoint
PRAGMA foreign_keys=ON;