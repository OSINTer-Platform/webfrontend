import { PUBLIC_API_BASE } from "$env/static/public";
import type {
  ArticleBase,
  ArticleSearchQuery,
  FullArticle,
} from "$shared/types/api";
import { cleanQuery } from "./searchQuery";
import { sortDocumentsById } from "./sort";

export function queryArticlesById(
  ids: string[],
  sort: boolean,
  complete?: false,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<ArticleBase[]>;
export function queryArticlesById(
  ids: string[],
  sort: boolean,
  complete?: true,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<FullArticle[]>;
export function queryArticlesById(
  ids: string[],
  sort: boolean,
  complete = false,
  limit: number = 10000,
  fetchFn = fetch
): Promise<ArticleBase[] | FullArticle[]> {
  return queryDocumentsById(
    ids,
    sort,
    limit,
    complete,
    "/articles/search",
    fetchFn
  );

}

export function queryArticles(
  query: ArticleSearchQuery,
  complete?: false,
  fetchFn?: typeof fetch
): Promise<{ documents: ArticleBase[] | null; response: Response }>;
export function queryArticles(
  query: ArticleSearchQuery,
  complete?: true,
  fetchFn?: typeof fetch
): Promise<{ documents: FullArticle[] | null; response: Response }>;
export function queryArticles(
  query: ArticleSearchQuery,
  complete = false,
  fetchFn = fetch
): Promise<{
  documents: ArticleBase[] | FullArticle[] | null;
  response: Response;
}> {
  return queryDocuments(query, "/articles/search", complete, fetchFn);
}

async function queryDocumentsById(
  ids: string[],
  sort: boolean,
  limit: number,
  complete: boolean,
  searchRoute: string,
  fetchFn: typeof fetch
): Promise<any[]> {
  if (ids.length < 1) return [];

  const documents = await queryDocuments(
    { limit, ids },
    searchRoute,
    complete,
    fetchFn
  ).then(({ documents }) => documents ?? []);

  if (sort) return sortDocumentsById(ids, documents, (a) => a.id);
  return documents;
}

async function queryDocuments(
  query: { [key: string]: any },
  searchRoute: string,
  complete: boolean,
  fetchFn: typeof fetch
): Promise<{ documents: any[] | null; response: Response }> {
  const r = await fetchFn(
    `${PUBLIC_API_BASE}${searchRoute}?complete=${encodeURIComponent(complete)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );
  return { documents: r.ok ? await r.json() : null, response: r };
}
