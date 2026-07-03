import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param: string) => {
    return !Number.isNaN(Number(param)) && Number(param) > 0;
}) satisfies ParamMatcher;