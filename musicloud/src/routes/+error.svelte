<script lang="ts">
    import { page } from "$app/state";
</script>

<div
    class="min-h-screen flex items-center justify-center bg-gray-950 text-white"
>
    <main class="max-w-4xl w-full px-6 py-12">
        <div
            class="bg-gray-800 rounded-3xl border border-gray-700 shadow-xl p-8"
        >
            <div class="flex flex-col md:flex-row items-stretch gap-4">
                <div class=" w-full md:basis-1/3 flex items-center justify-center rounded-2xl p-6 bg-linear-to-tl from-blue-500 to-purple-500">
                    <h1 class="text-3xl font-bold text-white">
                        {page.status}
                    </h1>
                </div>

                <div class="w-full md:basis-2/3">
                    <h1 class="text-3xl font-bold text-white">
                        {page.error?.message}
                    </h1>

                    <p class="mt-3 text-sm text-gray-300 leading-6">
                        The page you are looking for doesn't exist or has been
                        moved. If you followed a link, it may be broken or
                        outdated.
                    </p>

                    <div class="mt-3">
                        <a
                            href="/"
                            class="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                        >
                            ← Back to home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
