import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteTrackById } from "$lib/server/db/music";
import { rm } from "node:fs/promises";

export const POST: RequestHandler = async ({ locals, request }) => {
    if(!locals.user) {
        error(403, "You are not allowed to do this.");
    }

    const { trackId } = await request.json();

    if (!trackId || Number.isNaN(trackId) || trackId < 0){
        error(400, "Incorrect ID");
    } 

    const deletedTrack = await deleteTrackById(trackId);

    // delete file
    if (!deletedTrack) {
        error(400, "No track corresponding to this ID");
    } else if (deletedTrack) {
     // rm( deletedTrack.audioFile );
     //TODO: delete the file
    }

    return json(deletedTrack);
};