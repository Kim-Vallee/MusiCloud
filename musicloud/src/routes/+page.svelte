<script lang="ts">
    import type { PageProps } from "./$types";

    import WaveSurfer from "wavesurfer.js";

    const audioAssets = import.meta.glob("../lib/audio/*.{mp3,wav,ogg}", {
        eager: true,
        import: "default",
    }) as Record<string, string>;

    let { data }: PageProps = $props();
    let searchQuery = $state("");
    let activeTrackId: number | null = $state(null);

    const isAuthenticated = $derived(Boolean(data.isAuthenticated));

    let wavesurfers = new Map<HTMLElement, WaveSurfer>();

    function getAudioUrl(audioFile: string | null) {
        if (!audioFile) return "";
        return audioAssets[`../lib/audio/${audioFile}`] ?? "";
    }

    function waveform(node: HTMLElement, audio: string) {
        import('wavesurfer.js').then((module) => {
            const WaveSurfer = module.default;

            if (!audio) return;

            let wavesurfer = WaveSurfer.create({
                container: node,
                waveColor: '#9810FA',
                progressColor: '#155DFC',
                barWidth: 4,
                barHeight: 0.8,
                barRadius: 2
            });

            const parent = node.parentElement?.parentElement;
            if (parent) wavesurfers.set(parent, wavesurfer);
            else console.log('Error');

            wavesurfer.load(audio);
        })
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

    $effect(() => {
        // Filter sounds based on search query
    });
</script>

<div class="min-h-screen bg-gray-950">

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-6">
        
        <div class="mx-auto py-8">
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
                >
                    <!-- Card Header -->
                    <div class="h-32 relative overflow-hidden">
                        <div
                            use:waveform={getAudioUrl(track.audioFile)}
                            class="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity bg-black/20"
                        ></div>
                    </div>

                    <!-- Card Content -->
                    <div class="p-5">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <div class="min-w-0">
                                <a href="/track/{track.id}" class="text-lg font-bold text-white truncate">
                                    {track.title}
                                </a>
                                <p class="text-sm text-gray-400 truncate">
                                    by {track.author}
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                            {#each track.tags as tag}
                                <span class="text-[11px] px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700/50">
                                    {tag}
                                </span>
                            {/each}
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="mb-3 border-t border-gray-700 pt-3 text-xs text-gray-400">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <span>Duration</span>
                                    <!-- <span class="text-gray-200">{dateFormat(track.duration, "mm:ss")}</span> -->
                                    <span class="text-gray-200">{Math.floor(track.duration / 60) }:{track.duration % 60}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>Styles</span>
                                    <span class="text-gray-200">{track.styles}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>BPM</span>
                                    <span class="text-gray-200">{track.bpm}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>Uploaded</span>
                                    <span class="text-gray-200">{track.uploadedAt.toDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-center">
                            <button
                                onclick={(event) => playPauseTrack(track.id, event)}
                                class="inline-flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                                aria-label="Play or pause track"
                            >
                                {#if activeTrackId === track.id}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 pointer-events-none">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 pointer-events-none">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
