import type { Actions, PageServerLoad } from "./$types";
import { deleteTrackById, getAllTracks, getTrackById, hideTrackById, showTrackById } from "$lib/server/db/music";
import { error, fail } from "@sveltejs/kit";
import { getAudioPath } from "$lib/assets";
import { rm } from "node:fs/promises";

export const load: PageServerLoad = async ({ locals }) => {
    let isAuthenticated = Boolean(locals.user);
    return {
        tracks: getAllTracks(isAuthenticated),
        isAuthenticated: isAuthenticated,
    };
};

export const actions: Actions = {
    delete_track: async ({ locals, request }) => {
        if (!locals.user) {
            throw error(403, 'You must be authenticated to delete a track');
        }

        const formData = await request.formData();
        const trackId = Number.parseInt(String(formData.get('trackId') ?? ''));

        if (!trackId || Number.isNaN(trackId)) {
            return fail(400, { error: 'Track Id is not valid' });
        }

        const deletedTrack = await deleteTrackById(trackId);

        if (!deletedTrack) {
            return fail(400, { error: "No track corresponding to this Id" });
        }

        const filePath = getAudioPath(deletedTrack.audioFile);

        try {
            await rm(filePath);
        } catch (err) {
            console.log(err);
            throw error(500, "Error while deleting the file");
        }

        return { success: true, message: `Track ${deletedTrack.title} (id ${deletedTrack.id}) was deleted successfully.` };
    },
    hide_track: async ({ locals, request }) => {
        if (!locals.user) {
            throw error(403, 'You must be authenticated to change the visibility of a track');
        }

        const formData = await request.formData();
        const trackId = Number.parseInt(String(formData.get('trackId') ?? ''));

        if (!trackId || Number.isNaN(trackId)) {
            return fail(400, { error: 'Track Id is not valid' });
        }

        const track = getTrackById(trackId);

        if (!track) {
            return fail(400, { error: "No track corresponding to this Id" });
        }

        if (track.hidden) {
            await showTrackById(track.id);
            return { success: true, message: `Track ${track.title} (id ${track.id}) was shown successfully.` };
        }

        await hideTrackById(track.id);

        return { success: true, message: `Track ${track.title} (id ${track.id}) was hidden successfully.` };
    }
}