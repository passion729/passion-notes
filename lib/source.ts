import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { icons } from 'lucide-react';
import { createElement } from 'react';


// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
    baseUrl: '/notes',
    source: docs.toFumadocsSource(),
    plugins: [lucideIconsPlugin()],
    icon(icon) {
        if (!icon) {
            // You may set a default icon
            return;
        }
        if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
    },
});

export function getPageImage(page: InferPageType<typeof source>) {
    const segments = [...page.slugs, 'image.png'];

    return {
        segments,
        url: `/og/docs/${ segments.join('/') }`,
    };
}

export async function getLLMText(page: InferPageType<typeof source>) {
    // Try to get raw content first, fallback to processed if not available
    let content: string;
    try {
        content = await page.data.getText('raw');
    } catch {
        content = await page.data.getText('processed');
    }

    // Remove frontmatter if present (content between --- markers at the start)
    content = content.replace(/^---\n[\s\S]*?\n---\n/, '');

    return `# ${ page.data.title }

${ content }`;
}
