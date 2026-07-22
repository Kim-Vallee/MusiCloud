import type { PageServerLoad } from "./$types";
import { getAllTracks } from "$lib/server/db/music";

export const load: PageServerLoad = async ({ locals }) => {
    return {
        tracks: getAllTracks().map((track) => ({
            ...track,
            audioUrl: `/content/${track.audioFile}`,
        })),
        isAuthenticated: Boolean(locals.user),
    };
};