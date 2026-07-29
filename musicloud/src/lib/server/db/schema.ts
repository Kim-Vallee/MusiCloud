import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const music = sqliteTable('music', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	authors: text('authors', {mode: 'json'}).notNull().$type<string[]>().default(['Tachyon']),
	description: text('description'),
	uploadedAt: integer('uploaded_at', { mode: 'timestamp'}).notNull().$defaultFn(() => new Date()),
	bpm: integer('bpm'),
	styles: text('style', { mode: 'json' }).$type<string[]>(),
	hidden: integer('hidden', { mode: 'boolean' }).default(false).notNull(),
	setup: text('setup'),
	tags: text('tags', { mode: 'json' }).$type<string[]>(),
	audioFile: text('audio_file').notNull(),
	duration: integer('duration').notNull().default(0),
})
