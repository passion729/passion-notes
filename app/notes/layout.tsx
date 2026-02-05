import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "@/lib/layout.shared";
import Image from "next/image";

export default function Layout({ children }: LayoutProps<"/notes">) {
    const { nav, ...base } = baseOptions();
    return (
        <DocsLayout
            {...base}
            tree={source.getPageTree()}
            {...baseOptions()}
            nav={{
                ...nav,
                mode: 'top',
                title: (
                    <div className="inline-flex items-center gap-3">
                        <Image src="/snoopy.png" alt="Avatar" width={40} height={40} />
                        <span className="font-semibold text-lg">Passion's Notes</span>
                    </div>
                ),
            }}
            tabMode="navbar"
            // sidebar={{
            //     tabs: [
            //         {
            //             title: '文档',
            //             url: '/docs',
            //         },
            //         {
            //             title: '笔记',
            //             url: '/notes',
            //         },
            //     ],
            // }}
        >
            {children}
        </DocsLayout>
    );
}
