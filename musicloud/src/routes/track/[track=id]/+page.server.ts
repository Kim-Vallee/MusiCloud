import type { PageServerLoad } from "./$types";
import { getTrackById } from "$lib/server/db/music";
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, params }) => {
    let track = getTrackById(Number(params.track));
    if (!track) {
        error(404, {
            message: 'Track does not exist'
        });
    }
    return {
        track: {
            ...track,
            audioUrl: `/content/${track.audioFile}`,
        },
        isAuthenticated: Boolean(locals.user),
    };
};