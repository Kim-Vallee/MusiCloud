import { db } from ".";
import { music } from "./schema";
import { eq, like, and, sql, gte, lte } from "drizzle-orm";

export const getAllMusics = () => db.select().from(music).all();
export const getMusicsByTitle = (title: string) => db.select().from(music).where(like(music.title, '%' + title + '%')).all();
export const getMusicsByAuthor = (author: string) => db.select().from(music).where(eq(music.author, author)).all();
export const getMusicsByStyle = (style: string) => db.select().from(music).where(eq(music.style, style)).all();
export const getMusicsByBPM = (bpm: number) => db.select().from(music).where(eq(music.bpm, bpm)).all();

export const getMusicsByTags = (tags: string) => {
    const array_tags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

    if (array_tags.length === 0) return [];

    const conditions = array_tags.map((tag) =>
        sql`EXISTS (SELECT 1 FROM json_each(${music.tags}) WHERE value = ${tag})`
    );

    return db.select().from(music).where(and(...conditions)).all();
}

export const getMusicsByDates = (start_date: Date, end_date: Date) => {
    return db.select().from(music).where(and(gte(music.uploadedAt, start_date), lte(music.uploadedAt, end_date))).all();
}
