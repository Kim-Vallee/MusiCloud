<script lang="ts">
    import type { PageProps } from "./$types";
    import { authClient } from "$lib/client";
    import { goto } from "$app/navigation";

    let { data }: PageProps = $props();

    const session = authClient.useSession();

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

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read
    the documentation, and {data.test_variable.test1}
</p>
<div>
    {#if $session.data}
        <div>
            <p>
                {$session.data.user.name}
            </p>
            <button
                onclick={async () => {
                    await authClient.signOut();
                }}
            >
                Sign Out
            </button>
        </div>
    {:else}
        <button
            onclick={handleGitHubSignIn}
            style="background: red;"
        >
            Continue with GitHub
        </button>
    {/if}
</div>
