import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    return {
        test_variable: {
            test1: '%' + 'The content' + '%'
        }
    };
};