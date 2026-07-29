import type { SQLiteSelect } from "drizzle-orm/sqlite-core";
import { db } from ".";
import { music } from "./schema";
import { eq, like, and, sql, gte, lte, desc } from "drizzle-orm";

export type Track = {
    id: number;
    title: string;
    authors: string[];
    description?: string | null;
    uploadedAt?: Date | null;
    bpm?: number | null;
    styles?: string[] | null;
    hidden: boolean;
    setup?: string | null;
    tags?: string[] | null;
    audioFile: string;
    duration: number;
};

function paginate<T extends SQLiteSelect>(
    qb: T,
    page: number = 1,
    pageSize: number = 10,
) {
    return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export const getAllTracks = (showAll: boolean, page?: number, pageSize: number = 10) => {
    // Start with base query (no need for .$dynamic() when reassigning)
    let query = db.select().from(music).$dynamic();

    // Apply visibility filter only if needed
    if (!showAll) {
        query = query.where(eq(music.hidden, false));
    }

    // Always order by upload date
    query = query.orderBy(desc(music.uploadedAt));

    // Apply pagination only if a valid page number is provided
    if (page !== undefined && page > 0) {
        query = paginate(query, page, pageSize);
    }

    return query.all();
}

export const getTrackByTitle = (title: string) => db.select().from(music).where(like(music.title, '%' + title + '%')).all();
export const getTrackByBPM = (bpm: number) => db.select().from(music).where(eq(music.bpm, bpm)).all();
export const getTrackById = (id: number) => db.select().from(music).where(eq(music.id, id)).all()[0] ?? null;

export const hideTrackById = async (id: number) => {
    return db.update(music)
        .set({
            hidden: true
        }).where(eq(music.id, id));
}

export const showTrackById = async (id: number) => {
    return db.update(music)
        .set({
            hidden: false
        }).where(eq(music.id, id));
}

export const updateTrackById = async (id: number, input: {
    title: string;
    authors: string[];
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
            authors: input.authors,
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
    authors: string[];
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
        authors: input.authors,
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
