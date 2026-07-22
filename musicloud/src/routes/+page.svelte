<script lang="ts">
    import type { PageData } from "./$types";
    import type { Track } from "$lib/server/db/music";

    import WaveSurfer from "wavesurfer.js";
    import { fade } from "svelte/transition";

    let { data }: { data: PageData } = $props();
    let searchQuery = $state("");
    let activeTrackId: number | null = $state(null);
    let showDeleteModal = $state(false);
    let trackToDelete: { id: number; title: string } | null = $state(null);
    let trackDeleted: Track | null = $state(null);

    const isAuthenticated = $derived(Boolean(data.isAuthenticated));

    let wavesurfers = new Map<HTMLElement, WaveSurfer>();

    function waveform(node: HTMLElement, audio: string) {
        import("wavesurfer.js").then((module) => {
            const WaveSurfer = module.default;

            if (!audio) return;

            let wavesurfer = WaveSurfer.create({
                container: node,
                waveColor: "#9810FA",
                progressColor: "#155DFC",
                barWidth: 4,
                barHeight: 0.8,
                barRadius: 2,
            });

            const parent = node.parentElement?.parentElement;
            if (parent) wavesurfers.set(parent, wavesurfer);
            else console.log("Error");

            wavesurfer.load(audio);
        });
    }

    function playPauseTrack(soundId: number, event: MouseEvent) {
        const button = event.currentTarget as HTMLElement;
        const parent = button.closest(".group") as HTMLElement;
        if (!parent) return;

        let wavesurfer = wavesurfers.get(parent);
        if (!wavesurfer) return;

        if (wavesurfer.isPlaying()) {
            wavesurfer.pause();
            activeTrackId = null;
            return;
        }

        wavesurfers.forEach((ws: WaveSurfer) => {
            if (ws !== wavesurfer && ws.isPlaying()) {
                ws.pause();
            }
        });

        wavesurfer.play();
        activeTrackId = soundId;
    }

    function openDeleteModal(track: { id: number; title: string }) {
        trackToDelete = track;
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        trackToDelete = null;
    }

    async function deleteTrack() {
        const response = await fetch("/admin/delete", {
            method: "POST",
            body: JSON.stringify({ trackId: trackToDelete?.id }),
            headers: {
                "content-type": "application/json",
            },
        });

        trackDeleted = await response.json();

        if (trackDeleted) {
            document.getElementById(`track-id-${trackDeleted.id}`)?.remove();
            setTimeout(() => {
                trackDeleted = null;
            }, 5000)
        }


        closeDeleteModal();
    }

    $effect(() => {
        // Filter sounds based on search query
    });
</script>

<div class="min-h-screen bg-gray-950">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="mx-auto py-8">
            {#if isAuthenticated && trackDeleted}
                <div
                    class="w-full fixed right-4 top-4 z-50 max-w-sm rounded-xl border border-green-500/40 bg-green-950/95 px-4 py-3 text-sm text-red-100 shadow-lg shadow-black/30 backdrop-blur"
                    out:fade
                    in:fade
                >
                    Track {trackDeleted.title} (id {trackDeleted.id}) was deleted successfully.
                </div>
            {/if}
            <h1 class="text-3xl font-bold text-white mb-6">MusiCloud</h1>

            <!-- Search Bar -->
            <div class="relative">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search tracks by title, artist, or style..."
                    class="w-full px-4 py-3 pl-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all"
                />
                <svg
                    class="absolute left-3 top-3 w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
            </div>
        </div>
        <!-- Tracks Grid -->
        <div class="grid grid-cols-1 gap-6">
            {#if isAuthenticated}
                <a
                    href="/admin/add"
                    class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/70 p-6 text-center text-sm font-medium text-gray-300 transition-all hover:border-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"
                >
                    Add track
                </a>
            {/if}
            {#each data.tracks as track (track.id)}
                <div
                    class="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden group"
                    id="track-id-{track.id}"
                >
                    <!-- Card Header -->
                    <div class="h-32 relative overflow-hidden">
                        <div
                            use:waveform={track.audioUrl}
                            class="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity bg-black/20"
                        ></div>
                    </div>

                    <!-- Card Content -->
                    <div class="p-5">
                        <div
                            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3"
                        >
                            <div class="min-w-0">
                                <a
                                    href="/track/{track.id}"
                                    class="text-lg font-bold text-white truncate"
                                >
                                    {track.title}
                                </a>
                                <p class="text-sm text-gray-400 truncate">
                                    by {track.author}
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                {#each track.tags as tag}
                                    <span
                                        class="text-[11px] px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700/50"
                                    >
                                        {tag}
                                    </span>
                                {/each}
                            </div>
                        </div>

                        <!-- Info -->
                        <div
                            class="mb-3 border-t border-gray-700 pt-3 text-xs text-gray-400"
                        >
                            <div
                                class="flex flex-wrap items-center justify-between gap-3"
                            >
                                <div class="flex items-center gap-2">
                                    <span>Duration</span>
                                    <span class="text-gray-200"
                                        >{Math.floor(
                                            track.duration / 60,
                                        )}:{Math.round(
                                            track.duration % 60,
                                        )}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>Styles</span>
                                    {#each track.styles as style}
                                        <span
                                            class="text-[11px] px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full border border-purple-700/50"
                                        >
                                            {style}
                                        </span>
                                    {/each}
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>BPM</span>
                                    <span class="text-gray-200">
                                        {#if track.bpm}
                                            {track.bpm}
                                        {:else}
                                            N/A
                                        {/if}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>Uploaded</span>
                                    <span class="text-gray-200"
                                        >{track.uploadedAt.toDateString()}</span
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-center gap-2">
                            <button
                                type="button"
                                onclick={(event) =>
                                    playPauseTrack(track.id, event)}
                                class="inline-flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                                aria-label="Play or pause track"
                            >
                                {#if activeTrackId === track.id}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6 pointer-events-none"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"
                                        />
                                    </svg>
                                {:else}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6 pointer-events-none"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                        />
                                    </svg>
                                {/if}
                            </button>

                            {#if isAuthenticated}
                                <a
                                    href="/admin/update/{track.id}"
                                    class="inline-flex items-center justify-center w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                                    aria-label="Modify track"
                                    title="Modify track"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="size-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                    </svg>
                                </a>

                                <button
                                    type="button"
                                    onclick={() => openDeleteModal(track)}
                                    class="inline-flex items-center justify-center w-12 h-12 text-white rounded-xl transition-colors bg-red-600 hover:bg-red-700"
                                    aria-label="Delete track"
                                    title="Delete track"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="size-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                    </svg>
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    {#if showDeleteModal && trackToDelete}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        >
            <div
                class="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl shadow-black/40"
            >
                <h2 class="text-xl font-semibold text-white">Delete track?</h2>
                <p class="mt-3 text-sm text-gray-400">
                    Are you sure you want to delete <span
                        class="font-medium text-white"
                        >{trackToDelete.title}</span
                    >?
                </p>
                <div class="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onclick={closeDeleteModal}
                        class="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onclick={deleteTrack}
                        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        Confirm delete
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
