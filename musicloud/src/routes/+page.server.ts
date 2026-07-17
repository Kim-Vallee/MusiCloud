import type { PageServerLoad } from "./$types";
import { getAllTracks } from "$lib/server/db/music";

export const load: PageServerLoad = async ({ locals }) => {
    return {
        tracks: getAllTracks(),
        isAuthenticated: Boolean(locals.user),
    };
};