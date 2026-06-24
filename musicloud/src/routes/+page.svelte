<script lang="ts">
    import type { PageProps } from "./$types";
    import { authClient } from "$lib/client";
    import { goto } from "$app/navigation";

    let { data }: PageProps = $props();
    let searchQuery = $state("");

    const session = authClient.useSession();

    // Sample sound data
    const sounds = [
        {
            id: 1,
            title: "Midnight Jazz",
            author: "Alex Rivers",
            uploadDate: "2024-06-10",
            bpm: 120,
            style: "Jazz",
            duration: "3:45",
        },
        {
            id: 2,
            title: "Ambient Waves",
            author: "Luna Echo",
            uploadDate: "2024-06-15",
            bpm: 80,
            style: "Ambient",
            duration: "5:20",
        },
        {
            id: 3,
            title: "Electric Dreams",
            author: "Synth Master",
            uploadDate: "2024-06-20",
            bpm: 130,
            style: "Synthwave",
            duration: "4:10",
        },
        {
            id: 4,
            title: "Soul Deep",
            author: "Deep Grooves",
            uploadDate: "2024-06-12",
            bpm: 95,
            style: "Soul",
            duration: "3:55",
        },
        {
            id: 5,
            title: "Neon Nights",
            author: "City Lights",
            uploadDate: "2024-06-18",
            bpm: 140,
            style: "Electronic",
            duration: "4:30",
        },
        {
            id: 6,
            title: "Forest Whispers",
            author: "Nature Sounds",
            uploadDate: "2024-06-22",
            bpm: 70,
            style: "Ambient",
            duration: "6:00",
        },
    ];

    $effect(() => {
        // Filter sounds based on search query
    });

    async function handleGitHubSignIn() {
        try {
            await authClient.signIn.social({
                provider: "github",
            });
        } catch (error) {
            // Silently redirect on auth failure
            goto("/");
        }
    }
</script>

<div class="min-h-screen bg-gray-950">
    <!-- Header with Search -->
    <div class="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <h1 class="text-3xl font-bold text-white mb-6">MusiCloud</h1>

            <!-- Search Bar -->
            <div class="relative">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search sounds by title, artist, or style..."
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
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
        <!-- Sounds Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each sounds as sound (sound.id)}
                <div
                    class="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden group"
                >
                    <!-- Card Header -->
                    <div class="h-32 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                        <div
                            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                        ></div>
                    </div>

                    <!-- Card Content -->
                    <div class="p-5">
                        <h3 class="text-lg font-bold text-white mb-1 truncate">
                            {sound.title}
                        </h3>

                        <p class="text-sm text-gray-400 mb-4 truncate">
                            by {sound.author}
                        </p>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span
                                class="text-xs px-2.5 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700/50"
                            >
                                {sound.style}
                            </span>
                            <span
                                class="text-xs px-2.5 py-1 bg-purple-900/50 text-purple-300 rounded-full border border-purple-700/50"
                            >
                                {sound.bpm} BPM
                            </span>
                        </div>

                        <!-- Info Grid -->
                        <div class="space-y-2 mb-4 pb-4 border-t border-gray-700 pt-4">
                            <div class="flex justify-between text-xs text-gray-400">
                                <span>Duration</span>
                                <span class="text-gray-200">{sound.duration}</span>
                            </div>
                            <div class="flex justify-between text-xs text-gray-400">
                                <span>Uploaded</span>
                                <span class="text-gray-200">{sound.uploadDate}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-2">
                            <button
                                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Play
                            </button>
                            <button
                                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                ♡
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
