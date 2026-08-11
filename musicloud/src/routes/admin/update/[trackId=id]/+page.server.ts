import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllAuthors, getAllStyles, getAllTags, getTrackById, updateTrackById } from '$lib/server/db/music';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { getAudioDir, getAudioPath } from '$lib/assets';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { is } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
    const isAuthenticated = Boolean(locals.user);
    if (!isAuthenticated) {
        throw error(403, 'You must be authenticated to update a track.');
    }

    const track = await getTrackById(Number(params.trackId), isAuthenticated);

    if (!track) {
        throw error(404, 'Track not found');
    }

    const allTags = getAllTags(isAuthenticated);
    const allStyles = getAllStyles(isAuthenticated);
    const allAuthors = getAllAuthors(isAuthenticated);

    return {
        track: track,
        allUniqueAuthors: allAuthors,
        allUniqueStyles: allStyles,
        allUniqueTags: allAuthors
    };
};

export const actions: Actions = {
    update_track: async ({ locals, request, params }) => {
        const isAuthenticated = Boolean(locals.user);
        if (!isAuthenticated) {
            throw error(403, 'You must be authenticated to update a track.');
        }

        const trackId = Number(params.trackId);
        const existingTrack = await getTrackById(trackId, isAuthenticated);

        if (!existingTrack) {
            return fail(404, { error: 'Track not found.' });
        }

        const formData = await request.formData();
        const title = String(formData.get('title') ?? '').trim();
        const authors = String(formData.get('author') ?? '').trim();
        const description = String(formData.get('description') ?? '').trim();
        const bpm = String(formData.get('bpm') ?? '').trim();
        const styles = String(formData.get('styles') ?? '').trim();
        const setup = String(formData.get('setup') ?? '').trim();
        const tags = String(formData.get('tags') ?? '').trim();
        const audioFile = formData.get('audioFile');

        const fileTypes = ['wav', 'mp3', 'ogg', 'm4a'];

        if (!title) {
            return fail(400, { error: 'Title is required.' });
        }

        if (!authors) {
            return fail(400, { error: 'Author is required.' });
        }

        let audioFileName = existingTrack.audioFile;
        let filePath: string = "";
        let duration = existingTrack.duration;
        let shouldSaveNewFile = false;

        try {
            if (audioFile && audioFile instanceof File && audioFile.size > 0) {
                const extension = (audioFile.name.split('.').pop() ?? '').toLowerCase();
                if (!fileTypes.includes(extension)) {
                    return fail(400, { error: 'Unknown extension, allowed extensions are wav, mp3, ogg and m4a.' });
                }

                const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'track';
                const uniqueSuffix = Math.random().toString(16).slice(2, 10);
                audioFileName = `${uniqueSuffix}-${safeTitle}.${extension}`;

                // Save new file
                const audioDir = getAudioDir();
                await mkdir(audioDir, { recursive: true });
                filePath = join(audioDir, audioFileName);
                const bytes = await audioFile.arrayBuffer();
                await writeFile(filePath, Buffer.from(bytes));
                shouldSaveNewFile = true;

            }
        } catch (err) {
            console.log(err);
            return fail(500, { error: 'Failed to save file.' });
        }

        if (shouldSaveNewFile) {
            const execFileAsync = promisify(execFile);

            try {
                const { stdout } = await execFileAsync('ffprobe', [
                    '-v', 'error',
                    '-show_entries', 'format=duration',
                    '-of', 'default=noprint_wrappers=1:nokey=1',
                    filePath,
                ]);

                const seconds = Number.parseFloat(stdout.trim());
                if (!Number.isNaN(seconds) && seconds > 0) {
                    duration = seconds;
                } else {
                    return fail(500, { error: 'Internal error while computing the duration.' });
                }
            } catch (err) {
                console.log(err);
                return fail(500, { error: 'Internal error while computing the duration.' });
            }

            try {
                // Delete old file
                const filePathToDelete = getAudioPath(existingTrack.audioFile);
                await rm(filePathToDelete);
            } catch (err) {
                console.log(err);
                return fail(500, { error: 'Internal error while deleting the file.' });
            }
        }

        try {
            await updateTrackById(trackId, {
                title,
                authors: authors.split(',').map((author) => author.trim()).filter(Boolean),
                description: description || null,
                bpm: bpm ? Number(bpm) : null,
                styles: styles
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                setup: setup || null,
                tags: tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                audioFile: audioFileName,
                duration,
            });


            return { success: true, message: 'Track updated successfully.' };
        } catch (err) {
            console.log(err);

            return fail(500, { error: 'Unable to update the track right now.' });
        }
    },
};
