CREATE TABLE `authors` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `music` (
	`id` integer PRIMARY KEY,
	`title` text NOT NULL,
	`description` text,
	`uploaded_at` integer NOT NULL,
	`bpm` integer,
	`hidden` integer DEFAULT false NOT NULL,
	`setup` text,
	`audio_file` text NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `music_authors` (
	`music_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	CONSTRAINT `music_authors_pk` PRIMARY KEY(`music_id`, `author_id`),
	CONSTRAINT `fk_music_authors_music_id_music_id_fk` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_music_authors_author_id_authors_id_fk` FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `music_styles` (
	`music_id` integer NOT NULL,
	`style_id` integer NOT NULL,
	CONSTRAINT `music_styles_pk` PRIMARY KEY(`music_id`, `style_id`),
	CONSTRAINT `fk_music_styles_music_id_music_id_fk` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_music_styles_style_id_styles_id_fk` FOREIGN KEY (`style_id`) REFERENCES `styles`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `music_tags` (
	`music_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	CONSTRAINT `music_tags_pk` PRIMARY KEY(`music_id`, `tag_id`),
	CONSTRAINT `fk_music_tags_music_id_music_id_fk` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_music_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `styles` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL UNIQUE
);
