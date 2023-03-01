import type { PageLoad } from './$types';

import { config } from '$shared/config';
import type { ArticleBase } from '$shared/types/api';
import { handleResponse } from '$lib/common';

export const load = (({ params, fetch }) => {

    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(`${config.apiRoot}/user-items/${params.item_id}/articles`);
        return handleResponse(r);
    };

    return {
        articles: fetchArticles(),
    };
}) satisfies PageLoad;