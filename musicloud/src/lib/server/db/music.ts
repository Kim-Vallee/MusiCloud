import type { SQLiteSelect } from "drizzle-orm/sqlite-core";
import { db } from ".";
import {
    music,
    authors,
    styles,
    tags,
    musicAuthors,
    musicStyles,
    musicTags
} from "./schema";
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

export const getTrackByTitle = (title: string) => db.select().from(music).where(like(music.title, '%' + title + '%')).all();

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


const getOrCreateEntity = (
    table: typeof authors | typeof styles | typeof tags,
    name: string
): number => {
    const existing = db.select({ id: table.id })
        .from(table)
        .where(eq(table.name, name))
        .limit(1)
        .get();
    if (existing) return existing.id;

    const [newEntity] = db.insert(table)
        .values({ name: name.trim() })
        .returning({ id: table.id })
        .all();
    return newEntity.id;
};

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
    const tagNames = input.tags?.filter(Boolean) ?? [];
    const styleNames = input.styles?.filter(Boolean) ?? [];
    const authorNames = input.authors.filter(Boolean) ?? [];

    // Decide which fields to update on the music record
    const musicUpdateData: Record<string, any> = {};
    if (input.title !== undefined) musicUpdateData.title = input.title.trim();
    if (input.description !== undefined) musicUpdateData.description = input.description?.trim() || null;
    if (input.bpm !== undefined) musicUpdateData.bpm = input.bpm ?? null;
    if (input.setup !== undefined) musicUpdateData.setup = input.setup?.trim() || null;
    if (input.audioFile !== undefined) musicUpdateData.audioFile = input.audioFile.trim();
    if (input.duration !== undefined) musicUpdateData.duration = input.duration;

    return db.transaction(() => {
        // 1. Update the music record (only if there are changes)
        if (Object.keys(musicUpdateData).length > 0) {
            db.update(music)
                .set(musicUpdateData)
                .where(eq(music.id, id))
                .run();
        }

        // 2. Replace authors (only if the field was provided)
        if (input.authors !== undefined) {
            // Delete all existing author links for this track
            db.delete(musicAuthors).where(eq(musicAuthors.musicId, id)).run();

            // Insert new ones
            for (const authorName of authorNames) {
                const authorId = getOrCreateEntity(authors, authorName);
                db.insert(musicAuthors).values({
                    musicId: id,
                    authorId,
                }).onConflictDoNothing().run();
            }
        }

        // 3. Replace styles
        if (input.styles !== undefined) {
            db.delete(musicStyles).where(eq(musicStyles.musicId, id)).run();

            for (const styleName of styleNames) {
                const styleId = getOrCreateEntity(styles, styleName);
                db.insert(musicStyles).values({
                    musicId: id,
                    styleId,
                }).onConflictDoNothing().run();
            }
        }

        // 4. Replace tags
        if (input.tags !== undefined) {
            db.delete(musicTags).where(eq(musicTags.musicId, id)).run();

            for (const tagName of tagNames) {
                const tagId = getOrCreateEntity(tags, tagName);
                db.insert(musicTags).values({
                    musicId: id,
                    tagId,
                }).onConflictDoNothing().run();
            }
        }

        return id;
    });
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
    const authorsToInsert = input.authors.filter(name => name.trim() !== '') ?? [];
    const tagsToInsert = input.tags?.filter(Boolean) ?? [];
    const stylesToInsert = input.styles?.filter(Boolean) ?? [];

    return await db.transaction(() => {
        const [newTrack] = db.insert(music).values({
            title: input.title.trim(),
            description: input.description?.trim() || null,
            uploadedAt: input.uploadedAt ?? new Date(),
            bpm: input.bpm ?? null,
            setup: input.setup?.trim() || null,
            audioFile: input.audioFile.trim(),
            duration: input.duration,
        }).returning({ id: music.id }).all();

        const trackId = newTrack.id;

        // 3. Process authors
        for (const authorName of authorsToInsert) {
            const authorId = getOrCreateEntity(authors, authorName);
            db.insert(musicAuthors).values({
                musicId: trackId,
                authorId: authorId,
            }).onConflictDoNothing().run(); // sync
        }

        // 4. Process styles
        for (const styleName of stylesToInsert) {
            const styleId = getOrCreateEntity(styles, styleName);
            db.insert(musicStyles).values({
                musicId: trackId,
                styleId: styleId,
            }).onConflictDoNothing().run();
        }

        // 5. Process tags
        for (const tagName of tagsToInsert) {
            const tagId = getOrCreateEntity(tags, tagName);
            db.insert(musicTags).values({
                musicId: trackId,
                tagId: tagId,
            }).onConflictDoNothing().run();
        }

        return trackId;
    });
};
