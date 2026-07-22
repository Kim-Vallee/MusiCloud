import { db } from ".";
import { music } from "./schema";
import { eq, like, and, sql, gte, lte } from "drizzle-orm";

export type Track = {
    id: number;
    title: string;
    author: string;
    description?: string | null;
    uploadedAt?: Date | null;
    bpm?: number | null;
    styles?: string[] | null;
    setup?: string | null;
    tags?: string[] | null;
    audioFile: string;
    duration: number;
};

export const getAllTracks = () => db.select().from(music).all();
export const getTrackByTitle = (title: string) => db.select().from(music).where(like(music.title, '%' + title + '%')).all();
export const getTrackByAuthor = (author: string) => db.select().from(music).where(eq(music.author, author)).all();
export const getTrackByBPM = (bpm: number) => db.select().from(music).where(eq(music.bpm, bpm)).all();
export const getTrackById = (id: number) => db.select().from(music).where(eq(music.id, id)).all()[0] ?? null;

export const updateTrackById = async (id: number, input: {
    title: string;
    author: string;
    description?: string | null;
    bpm?: number | null;
    styles?: string[] | null;
    setup?: string | null;
    tags?: string[] | null;
    audioFile: string;
    duration: number;
}) => {
    const tags = input.tags?.filter(Boolean) ?? [];
    const styles = input.styles?.filter(Boolean) ?? [];

    return db.update(music)
        .set({
            title: input.title.trim(),
            author: input.author?.trim() || 'Tachyon',
            description: input.description?.trim() || null,
            bpm: input.bpm ?? null,
            styles,
            setup: input.setup?.trim() || null,
            tags,
            audioFile: input.audioFile.trim(),
            duration: input.duration,
        })
        .where(eq(music.id, id))
        .run();
};

export const deleteTrackById = async (id: number) => {
    const track = await db.delete(music).where(eq(music.id, id)).returning();
    if (!track) {
        return false;
    }
    return track[0];

}

export const createTrack = async (input: {
    title: string;
    author: string;
    description?: string | null;
    uploadedAt?: Date | null;
    bpm?: number | null;
    styles?: string[] | null;
    setup?: string | null;
    tags?: string[] | null;
    audioFile: string;
    duration: number;
}) => {
    const tags = input.tags?.filter(Boolean) ?? [];
    const styles = input.styles?.filter(Boolean) ?? [];

    return db.insert(music).values({
        title: input.title.trim(),
        author: input.author?.trim() || 'Tachyon',
        description: input.description?.trim() || null,
        uploadedAt: input.uploadedAt ?? new Date(),
        bpm: input.bpm ?? null,
        styles,
        setup: input.setup?.trim() || null,
        tags,
        audioFile: input.audioFile.trim(),
        duration: input.duration,
    }).run();
};

export const getTracksByTags = (tags: string) => {
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

export const getTracksByDates = (start_date: Date, end_date: Date) => {
    return db.select().from(music).where(and(gte(music.uploadedAt, start_date), lte(music.uploadedAt, end_date))).all();
}
