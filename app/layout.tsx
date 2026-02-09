import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Nunito, Noto_Sans_SC } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { i18n } from '@/lib/i18n';
import SearchDialog from '@/components/search';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={`${nunito.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider search={{SearchDialog,}} i18n={i18n}>{children}</RootProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
