import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createTrack, getAllTracks } from '$lib/server/db/music';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { getAudioDir } from '$lib/assets';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(403, 'You must be authenticated to add a track.');
    }

    const allTracks = getAllTracks(true);

    // Get all unique authors
    // Get all unique styles
    // Get all unique tags
};

export const actions: Actions = {
    add_track: async ({ locals, request }) => {
        if (!locals.user) {
            throw error(403, 'You must be authenticated to add a track.');
        }

        const formData = await request.formData();
        const title = String(formData.get('title') ?? '').trim();
        const author = String(formData.get('author') ?? '').trim();
        const description = String(formData.get('description') ?? '').trim();
        const uploadedAt = String(formData.get('uploadedAt') ?? '').trim();
        const bpm = String(formData.get('bpm') ?? '').trim();
        const styles = String(formData.get('styles') ?? '').trim();
        const setup = String(formData.get('setup') ?? '').trim();
        const tags = String(formData.get('tags') ?? '').trim();
        const audioFile = formData.get('audioFile');

        const fileTypes = ["wav", "mp3", "ogg", "m4a"];

        if (!title) {
            return fail(400, { error: 'Title is required.' });
        }

        if (!author) {
            return fail(400, { error: 'Author is required.' });
        }

        if (!audioFile) {
            return fail(400, {error: 'File is required. '}); 
        }

        let audioFileName: string = "";
        let filePath: string | null = null;

        try {
            if (audioFile && audioFile instanceof File && audioFile.size > 0) {
                const extension = audioFile.name.split('.').pop() ?? "";
                if (!fileTypes.includes(extension)) {
                    return fail(400, { error: 'Unknown extension, allowed extensions are wav, mp3, ogg and m4a.'});
                }
                const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'track';
                const uniqueSuffix = Math.random().toString(16).slice(2, 10);
                audioFileName = `${uniqueSuffix}-${safeTitle}.${extension}`;

                const audioDir = getAudioDir();
                await mkdir(audioDir, { recursive: true });
                filePath = join(audioDir, audioFileName);
                const bytes = await audioFile.arrayBuffer();
                await writeFile(filePath, Buffer.from(bytes));
            }
        } catch (err) {
            console.log(err);
            return fail(500, { error: "Failed to save file."})
        }

        if (!filePath || audioFileName === "") {
            return fail(400, "Unkown error while saving file");
        }

        // Get duration
        const execFileAsync = promisify(execFile);
        let duration = 0;

        try {
            if (!filePath) {
                return fail(500, { error: "FilePath incorrectly defined" });
            }
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
                return fail(500, "Internal error while computing the duration")
            }
        } catch (err) {
            console.log(err);
            return fail(500, "Internal error while computing the duration");
        }
        

        try {
            await createTrack({
                title,
                author,
                description: description || null,
                uploadedAt: uploadedAt ? new Date(uploadedAt) : null,
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
                duration
            });
            
            return { success: true, message: 'Track added successfully.' };
        } catch (err) {
            console.log(err);
            // Delete saved file:
            if (filePath) await rm(filePath);
            return fail(500, { error: 'Unable to add the track right now.' });
        }
    },
};
