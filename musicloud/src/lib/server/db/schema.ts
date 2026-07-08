import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const music = sqliteTable('music', {
	title: text('title').primaryKey(),
	author: text('author').notNull().default('Tachyon'),
	description: text('description'),
	uploadedAt: integer('uploaded_at', { mode: 'timestamp'}).notNull().$defaultFn(() => new Date()),
	bpm: integer('bpm'),
	style: text('style'),
	setup: text('setup'),
	tags: text('tags', { mode: 'json' }).$type<string[]>(),
	audioFile: text('audio_file')
})
