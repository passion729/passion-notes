import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import Image from 'next/image';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      nav={{
        ...baseOptions().nav,
        title: (
          <div className="inline-flex items-center gap-3">
            <Image src="/snoopy.png" alt="Avatar" width={40} height={40} />
            <span className="font-semibold text-lg">Passion's Notes</span>
          </div>
        ),
      }}
    >
      {children}
    </HomeLayout>
  );
}
