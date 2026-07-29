<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import Tagify from "@yaireo/tagify";

    let { data, form }: PageProps = $props();
    let selectedFileName = $state("");

    let tagsInput: HTMLInputElement | undefined;
    let stylesInput: HTMLInputElement | undefined;
    let authorInput: HTMLInputElement | undefined;

    let allTags = $derived(data.allUniqueTags);
    let allStyles = $derived(data.allUniqueStyles);
    let allAuthors = $derived(data.allUniqueAuthors);

    const inputClasses =
        "w-full rounded-lg border border-gray-700 bg-gray-800/80 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

    onMount(() => {
        const instances: Array<{ destroy: () => void }> = [];

        if (tagsInput) {
            instances.push(
                new Tagify(tagsInput, {
                    delimiters: ",",
                    maxTags: 10,
                    dropdown: { enabled: 0, maxItems: 6 },
                    keepInvalidTags: false,
                    whitelist: allTags,
                    originalInputValueFormat: (valuesArr) =>
                        valuesArr.map((item) => item.value).join(","),
                }),
            );
        }

        if (stylesInput) {
            instances.push(
                new Tagify(stylesInput, {
                    delimiters: ",",
                    maxTags: 10,
                    dropdown: { enabled: 0, maxItems: 6 },
                    keepInvalidTags: false,
                    whitelist: allStyles,
                    originalInputValueFormat: (valuesArr) =>
                        valuesArr.map((item) => item.value).join(","),
                }),
            );
        }

        if (authorInput) {
            instances.push(
                new Tagify(authorInput, {
                    delimiters: ",",
                    maxTags: 10,
                    dropdown: { enabled: 0, maxItems: 6 },
                    keepInvalidTags: false,
                    whitelist: allAuthors,
                    originalInputValueFormat: (valuesArr) =>
                        valuesArr.map((item) => item.value).join(","),
                }),
            );
        }
    });
</script>

<div class="min-h-screen bg-gray-950">
    <div class="mx-auto max-w-4xl px-6 py-10">
        <div
            class="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl shadow-black/30"
        >
            <div class="mb-8">
                <a
                    href="/"
                    class="text-sm text-blue-300 hover:text-white transition-colors"
                >
                    ← Back to home
                </a>
                <p
                    class="mb-2 text-sm uppercase tracking-[0.3em] text-blue-400"
                >
                    Admin
                </p>
                <h1 class="text-3xl font-semibold text-white">
                    Add a new track
                </h1>
                <p class="mt-2 text-sm text-gray-400">
                    Fill in the track details below to publish it to the
                    catalog.
                </p>
            </div>

            {#if form?.error}
                <div
                    class="mb-6 rounded-lg border border-red-700/40 bg-red-900/20 p-4 text-sm text-red-200"
                >
                    {form.error}
                </div>
            {/if}

            {#if form?.success}
                <div
                    class="mb-6 rounded-lg border border-emerald-700/40 bg-emerald-900/20 p-4 text-sm text-emerald-200"
                >
                    {form.message}
                </div>
            {/if}

            <form
                method="POST"
                class="space-y-6"
                action="?/add_track"
                enctype="multipart/form-data"
            >
                <div class="grid gap-6 md:grid-cols-2">
                    <div class="block text-sm font-medium text-gray-300">
                        <label class="mb-2 block" for="title">Title</label>
                        <input
                            name="title"
                            id="title"
                            required
                            placeholder="Midnight Jazz"
                            class={inputClasses}
                        />
                    </div>

                    <div class="block text-sm font-medium text-gray-300">
                        <label class="mb-2 block" for="author"> Author </label>
                        <input
                            bind:this={authorInput}
                            id="author"
                            name="author"
                            required
                            placeholder="Alex Rivers"
                            class="customTagify addTrackTagify {inputClasses}"
                        />
                    </div>

                    <div
                        class="block text-sm font-medium text-gray-300 md:col-span-2"
                    >
                        <label for="description" class="mb-2 block">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows="4"
                            placeholder="What makes this track special?"
                            class={inputClasses}
                        ></textarea>
                    </div>

                    <div class="block text-sm font-medium text-gray-300">
                        <label class="mb-2 block" for="bpm">BPM</label>
                        <input
                            id="bpm"
                            name="bpm"
                            type="number"
                            min="20"
                            max="320"
                            placeholder="120"
                            class={inputClasses}
                        />
                    </div>

                    <div class="block text-sm font-medium text-gray-300">
                        <label class="mb-2 block" for="styles">Styles</label>
                        <input
                            bind:this={stylesInput}
                            name="styles"
                            id="styles"
                            placeholder="Métal,Thrash métal"
                            class="customTagify addTrackTagify style-tagify {inputClasses}"
                        />
                    </div>

                    <div
                        class="block text-sm font-medium text-gray-300 md:col-span-2"
                    >
                        <label class="mb-2 block" for="setup">Setup</label>
                        <textarea
                            id="setup"
                            name="setup"
                            rows="3"
                            placeholder="Tell us how this track should be played or prepared."
                            class={inputClasses}
                        ></textarea>
                    </div>

                    <div
                        class="block text-sm font-medium text-gray-300 md:col-span-2"
                    >
                        <label class="mb-2 block" for="audiofile"
                            >Audio file</label
                        >
                        <div
                            class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/70 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-10 w-10 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 16.5V4.75m0 0l-3.75 3.75M12 4.75l3.75 3.75M4.5 14.25v2.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-2.25"
                                />
                            </svg>
                            <span class="mt-3 text-sm font-medium text-white"
                                >Drop your audio file here</span
                            >
                            <span class="mt-1 text-xs text-gray-400"
                                >MP3, WAV, OGG, M4A</span
                            >
                            <input
                                name="audioFile"
                                id="audiofile"
                                type="file"
                                accept="audio/*"
                                required
                                class="sr-only"
                                onchange={(event) => {
                                    selectedFileName =
                                        event.currentTarget.files?.[0]?.name ??
                                        "";
                                }}
                            />
                        </div>
                        {#if selectedFileName}
                            <p class="mt-2 text-sm text-gray-400">
                                Selected: {selectedFileName}
                            </p>
                        {/if}
                    </div>

                    <div
                        class="block text-sm font-medium text-gray-300 md:col-span-2"
                    >
                        <label class="mb-2 block" for="tags">Tags</label>
                        <input
                            bind:this={tagsInput}
                            name="tags"
                            id="tags"
                            placeholder="chill, lo-fi, cinematic"
                            class="customTagify addTrackTagify tag-tagify {inputClasses}"
                        />
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Add track
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
