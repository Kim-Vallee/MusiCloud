import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { BETTER_AUTH_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ALLOWED_GITHUB_EMAILS } from "$env/static/private";

export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: GITHUB_CLIENT_ID as string,
            clientSecret: GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [sveltekitCookies(getRequestEvent)],
    baseURL: BETTER_AUTH_URL as string,
    callbacks: {
        async signIn({ user, account }: { user: { email?: string | null }; account?: { provider?: string } }) {
            // Only allow specific GitHub usernames
            if (account?.provider === "github") {
                const email = user.email;
                if (!ALLOWED_GITHUB_EMAILS.includes(email ?? "")) {
                    return false; // Reject sign-in silently
                }
            }
            return true;
        },
    },
});