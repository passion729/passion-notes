import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import convert from 'npm-to-yarn';



// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
    dir: 'content/docs',
    docs: {
        schema: frontmatterSchema,
        postprocess: {
            includeProcessedMarkdown: true,
        },
    },
    meta: {
        schema: metaSchema,
    },
});

export default defineConfig({
    mdxOptions: {
        remarkPlugins: [remarkMdxMermaid],
        remarkNpmOptions: {
            persist: {
                id: 'package-manager',
            },
            packageManagers: [
                {
                    name: 'bun',
                    command: (command) => convert(command, 'bun'),
                },
                {
                    name: 'pnpm',
                    command: (command) => convert(command, 'pnpm'),
                },
            ],
        },
    },
    plugins: [lastModified()],
});
