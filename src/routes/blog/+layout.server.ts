import type { LayoutServerLoad } from './$types';
import type { Post } from '$shared/types/blog';
import matter from 'gray-matter';

export const load = (async () => {
    const posts = Object.fromEntries(
        Object.entries(
            import.meta.glob('$lib/blog/posts/*.md', { eager: true, as: 'raw' })
        ).map(([filepath, rawPost]) => {
            const filename = filepath.split('/').at(-1) as string;
            const fileid = filename.split('.')[0]; // FileID is filename without file-extension

            const matterPost = matter(rawPost);

            const post = {
                data: { ...matterPost.data, id: fileid },
                content: matterPost.content,
            } as Post;

            return [fileid, post];
        })
    );

    return { posts: posts };
}) satisfies LayoutServerLoad;
