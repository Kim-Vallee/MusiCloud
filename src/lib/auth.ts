import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL, CLIENT_ID_GITHUB, CLIENT_SECRET_GITHUB } from "$env/static/private";

export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: CLIENT_ID_GITHUB as string,
            clientSecret: CLIENT_SECRET_GITHUB as string,
        },
    },
    plugins: [sveltekitCookies(getRequestEvent)],
    baseURL: BETTER_AUTH_URL as string,
    callbacks: {
        async signIn({ user, account }: { user: { email?: string | null }; account?: { provider?: string } }) {
            // Only allow specific GitHub usernames
            if (account?.provider === "github") {
                return true
            }
            return false;
        },
    },
    secret: BETTER_AUTH_SECRET
});