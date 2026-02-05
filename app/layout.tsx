import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Nunito, Noto_Sans_SC } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
        <RootProvider>{children}</RootProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
