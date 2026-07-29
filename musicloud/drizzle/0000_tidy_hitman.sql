CREATE TABLE `music` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`authors` text DEFAULT '["Tachyon"]' NOT NULL,
	`description` text,
	`uploaded_at` integer NOT NULL,
	`bpm` integer,
	`style` text,
	`hidden` integer DEFAULT false NOT NULL,
	`setup` text,
	`tags` text,
	`audio_file` text NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL
);
