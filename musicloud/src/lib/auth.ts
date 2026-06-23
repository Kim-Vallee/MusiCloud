import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { BETTER_AUTH_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";


export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: GITHUB_CLIENT_ID as string,
            clientSecret: GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [sveltekitCookies(getRequestEvent)],
    baseURL: BETTER_AUTH_URL as string,
});