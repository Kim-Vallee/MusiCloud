<script lang="ts">
    import type WaveSurfer from "wavesurfer.js";

    import type { PageProps } from "./$types";

    const audioAssets = import.meta.glob("../../../lib/audio/*.{mp3,wav,ogg}", {
        eager: true,
        import: "default",
    }) as Record<string, string>;

    let { data }: PageProps = $props();

    let wavesurfer: WaveSurfer;
    let isPlaying: boolean = $state(false);

    function formatDate(date: Date) {
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function waveform(node: HTMLElement, audio: string | null) {
        if (!audio) {
            return;
        }

        let audio_url = audioAssets[`../../../lib/audio/${audio}`] ?? "";

        import("wavesurfer.js").then((module) => {
            const WaveSurfer = module.default;

            wavesurfer = WaveSurfer.create({
                container: node,
                waveColor: "#9810FA",
                progressColor: "#155DFC",
                barWidth: 4,
                barHeight: 0.8,
                barRadius: 2,
            });

            wavesurfer.load(audio_url);
        });
    }

    function togglePlay() {
        if (!wavesurfer) return;

        wavesurfer.playPause();

        if (wavesurfer.isPlaying()) isPlaying = true;
        else isPlaying = false;
    }
</script>

<div class="min-h-screen flex flex-col bg-gray-950">
    <main class="w-full px-6 py-12 flex-1 flex flex-col">
        <div
            class="flex-1 flex bg-gray-800 rounded-3xl border border-gray-700 shadow-xl overflow-hidden"
        >
            <div class="flex flex-col flex-1 p-8">
                <a
                    href="/"
                    class="text-sm text-blue-300 hover:text-white transition-colors"
                >
                    ← Back to home
                </a>
                <div
                    use:waveform={data.track.audioFile}
                    class="opacity-100 w-full bg-black/20 mt-4"
                ></div>

                <div class="mt-4">
                    <div
                        class="md:absolute md:left-1/2 md:transform md:-translate-x-1/2"
                    >
                        <button
                            type="button"
                            onclick={togglePlay}
                            class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                            aria-label="Play or pause track"
                        >
                            {#if isPlaying}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
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
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.5"
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
                    </div>
                    <div
                        class="flex flex-col gap-2 md:gap-6 md:flex-row md:items-start md:justify-between"
                    >
                        <div class="min-w-0 order-1">
                            <h2 class="text-2xl font-bold text-white truncate">
                                {data.track.title}
                            </h2>
                            <p class="text-sm text-gray-400 mt-2">
                                by {data.track.author}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex grow flex-col md:flex-row gap-3">
                    <div
                        class="relative rounded-2xl bg-gray-900 border border-gray-700 p-5 basis-1 md:basis-2/3"
                    >
                        <h3
                            class="text-sm font-semibold text-white uppercase tracking-[0.2em]"
                        >
                            Description
                        </h3>
                        <p class="mt-3 text-sm leading-6 text-gray-300 mb-5">
                            {data.track.description}
                        </p>
                    </div>
                    <div class="flex flex-col basis-1 md:basis-1/3 gap-3">
                        <div
                            class="rounded-2xl bg-gray-900 border border-gray-700 p-5 basis-1/2"
                        >
                            <h3
                                class="text-sm font-semibold text-white uppercase tracking-[0.2em]"
                            >
                                Infos
                            </h3>
                            <div class="mt-3 text-sm leading-6 text-gray-300">
                                <div class="">BPM: {data.track.bpm}</div>
                                <div class="mt-2">
                                    Duration:
                                    {Math.floor(data.track.duration / 60)}:{data
                                        .track.duration % 60}
                                </div>
                                <div class="mt-2">
                                    Upload date: {formatDate(
                                        data.track.uploadedAt,
                                    )}
                                </div>
                                <div class="mt-2">
                                    Styles:
                                    {#each data.track.styles as style}
                                        <span
                                            class="text-[11px] px-2 py-1 mx-1 bg-purple-900/50 text-purple-300 rounded-full border border-purple-700/50"
                                        >
                                            {style}
                                        </span>
                                    {/each}
                                </div>
                                <div class="mt-2">
                                    Tags:
                                    {#each data.track.tags as tag}
                                        <span
                                            class="text-[11px] px-2 py-1 mx-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700/50"
                                        >
                                            {tag}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                        <div
                            class="rounded-2xl bg-gray-900 border border-gray-700 p-5 basis-1/2"
                        >
                            <h3
                                class="text-sm font-semibold text-white uppercase tracking-[0.2em]"
                            >
                                Setup
                            </h3>
                            <p class="mt-3 text-sm leading-6 text-gray-300">
                                {data.track.setup}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
