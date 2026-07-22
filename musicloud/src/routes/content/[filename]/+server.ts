import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getAudioDir } from '$lib/assets';

const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
};

export const GET = async ({ params }) => {
    const filename = params.filename;

    if (!filename) {
        throw error(400, 'Missing audio filename.');
    }

    const filePath = join(getAudioDir(), filename);

    try {
        const file = await readFile(filePath);
        const extension = filename.split('.').pop()?.toLowerCase() ?? '';
        const contentType = mimeTypes[extension] ?? 'application/octet-stream';

        return new Response(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch {
        throw error(404, 'Audio file not found.');
    }
};
