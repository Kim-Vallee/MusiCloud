CREATE TABLE `music` (
	`title` text PRIMARY KEY NOT NULL,
	`author` text DEFAULT 'Tachyon' NOT NULL,
	`description` text,
	`uploaded_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`bpm` integer,
	`style` text,
	`setup` text,
	`tags` text
);
