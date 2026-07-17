import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createTrack } from '$lib/server/db/music';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { file } from 'better-auth';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(404, 'Not found');
    }
};

export const actions: Actions = {
    add_track: async ({ locals, request }) => {
        if (!locals.user) {
            return fail(403, { error: 'You must be authenticated to add a track.' });
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

        try {
            let audioFileName: string | null = null;
            
            console.log(audioFile);
            console.log(audioFile instanceof File);

            if (audioFile && audioFile instanceof File && audioFile.size > 0) {
                const extension = audioFile.name.split('.').pop() ?? "";
                if (!fileTypes.includes(extension)) {
                    return fail(500, { error: 'Unknown extension, allowed extensions are wav, mp3, ogg and m4a.'});
                }
                const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'track';
                const uniqueSuffix = Math.random().toString(16).slice(2, 10);
                audioFileName = `${uniqueSuffix}-${safeTitle}.${extension}`;

                const audioDir = join(fileURLToPath(new URL('../../../lib/audio', import.meta.url)));
                await mkdir(audioDir, { recursive: true });
                const filePath = join(audioDir, audioFileName);
                const bytes = await audioFile.arrayBuffer();
                console.log(filePath);
                await writeFile(filePath, Buffer.from(bytes));
            }

            // await createTrack({
            //     title,
            //     author: author || null,
            //     description: description || null,
            //     uploadedAt: uploadedAt ? new Date(uploadedAt) : null,
            //     bpm: bpm ? Number(bpm) : null,
            //     styles: styles
            //                 .split(',')
            //                 .map((tag) => tag.trim())
            //                 .filter(Boolean),
            //     setup: setup || null,
            //     tags: tags
            //         .split(',')
            //         .map((tag) => tag.trim())
            //         .filter(Boolean),
            //     audioFile: audioFileName,
            // });

            return { success: true, message: 'Track added successfully.' };
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Unable to add the track right now.' });
        }
    },
};
