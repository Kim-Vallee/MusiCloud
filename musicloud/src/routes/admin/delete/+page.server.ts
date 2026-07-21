import { error, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getTrackById, deleteTrackById } from "$lib/server/db/music";
import { success } from "better-auth";


export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(404, 'Not found');
    }


};


export const actions: Actions = {
    delete_track: async ({ locals, request }) => {
        if (!locals.user) {
            return fail(403, { error: 'You must be authenticated to add a track.' });
        }

        const data = await request.formData();
        const track_id = data.get('trackDeleteId') ?? '';
        if (!track_id) {
            return fail(400, {track_id, missing: true});
        }

        const track_id_number = Number.parseInt(String(track_id).trim());

        const track = deleteTrackById(track_id_number);

        if (!track) {
            return fail(400, {track_id, incorrect: true});
        }
        
        return {success: true, track: track};
    }
}