import type { Actions, PageServerLoad } from "./$types";
import { deleteTrackById, getAllTracks, getTrackById, hideTrackById, showTrackById, type Track } from "$lib/server/db/music";
import { error, fail, redirect } from "@sveltejs/kit";
import { getAudioPath } from "$lib/assets";
import { rm } from "node:fs/promises";

export const load: PageServerLoad = async ({ locals, url }) => {
    let isAuthenticated = Boolean(locals.user);

    // Clean URL before any db call

    const URLparams = new URLSearchParams(url.searchParams);
    for (const [key, value] of URLparams.entries()) {
        if (!value.trim()) {
            URLparams.delete(key);
        } else if (key === "p" && value == "0") {
            URLparams.delete(key);
        }
    }

    const cleanUrl = URLparams.toString();
    
    if (cleanUrl !== url.searchParams.toString()) {
        if (!cleanUrl) {
            throw redirect(303, "/");
        }
        throw redirect(303, `/?${cleanUrl}`);
    }

    // Working on pagination
    let page = url.searchParams.get("p");

    let allTracks = getAllTracks(isAuthenticated);
    const uniqueTags = new Set<string>();
    const uniqueStyles = new Set<string>();

    for (const track of allTracks) {
        for (const tag of track.tags ?? []) {
            if (tag) {
                uniqueTags.add(tag);
            }
        }
        for (const style of track.styles ?? []) {
            if (style) {
                uniqueStyles.add(style);
            }
        }
    }

    let allTags = Array.from(uniqueTags);
    let allStyles = Array.from(uniqueStyles);

    allTags.sort()
    allStyles.sort()


    // Filter tracks by search params
    const titleAuthorSearch = (url.searchParams.get("title-author-search") ?? "").toLowerCase();

    const tagsSearch = (url.searchParams.get("tag-filter") ?? "")
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

    const styleSearch = (url.searchParams.get("style-filter") ?? "")
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    allTracks = allTracks.filter((track) => {
        if (
            titleAuthorSearch &&
            !track.title.toLowerCase().includes(titleAuthorSearch) &&
            track.authors.filter((author) => author.toLowerCase().includes(titleAuthorSearch)).length === 0
        ) {
            return false;
        }

        if (!tagsSearch.every((tag) => track.tags?.includes(tag))) {
            return false;
        }

        if (!styleSearch.every((style) => track.styles?.includes(style))) {
            return false;
        }

        return true;
    });

    return {
        tracks: allTracks,
        allTags: allTags,
        allStyles: allStyles,
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