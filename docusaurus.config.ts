import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: "Passion's Notes",
    tagline: 'Dinosaurs are cool',
    favicon: 'img/Snoopy.png',
    // themes: ['@docusaurus/theme-search-algolia'],
    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://notes.passion7.tech',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    presets: [
        [
            'classic',
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: './sidebars.ts',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        metadata: [
            { name: "algolia-site-verification", content: "E5C7FE05294B835B"},
        ],
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: "Passion's Notes",
            logo: {
                alt: "Snoopy",
                src: 'img/Snoopy.png',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'notes',
                    position: 'left',
                    label: 'Notes',
                },
                { to: '/blog', label: 'Blog', position: 'left' },
                {
                    type: "search",
                    position: "right",
                },
                {
                    href: 'https://github.com/passion729',
                    position: 'right',
                    className: 'header-github-link',
                    'aria-label': 'GitHub',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${ new Date().getFullYear() } Passion. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.nightOwlLight,
            darkTheme: prismThemes.oceanicNext,
        },
        algolia: {
            // The application ID provided by Algolia
            appId: '36E6KCJMCK',

            // Public API key: it is safe to commit it
            apiKey: '06f8d215ba87a3e44f2ba50046bd26e3',

            indexName: 'notes',

            // Optional: see doc section below
            contextualSearch: true,

            // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
            externalUrlRegex: 'external\\.com|domain\\.com',

            // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
            replaceSearchResultPathname: {
                from: '/docs/', // or as RegExp: /\/docs\//
                to: '/',
            },

            // Optional: Algolia search parameters
            searchParameters: {},

            // Optional: path for search page that enabled by default (`false` to disable it)
            searchPagePath: 'search',

            // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
            insights: false,

            //... other Algolia params
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
