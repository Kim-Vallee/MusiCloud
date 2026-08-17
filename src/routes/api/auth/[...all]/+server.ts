import { auth } from "$lib/auth"; // path to your auth file
import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    return auth.handler(request);
};

export const GET: RequestHandler = async ({ request }) => {
    return auth.handler(request);
};