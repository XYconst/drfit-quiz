import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { Playfair_Display, Geist_Mono } from 'next/font/google';
import { META_PIXEL_ID } from '@/lib/pixel';
import './globals.css';

// Gilroy — only the two weights we have licensed (Type Mafia free pair).
// Body copy maps to Light (300); everything semibold/bold rounds up to ExtraBold (800).
const gilroy = localFont({
  src: [
    { path: '../public/fonts/Gilroy-Light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/Gilroy-ExtraBold.otf', weight: '800', style: 'normal' },
  ],
  variable: '--font-sans-runtime',
  display: 'swap',
  fallback: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
});
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display-runtime',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono-runtime',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Dr.Fit: Твоят 90-дневен план',
  description: 'Намери защо метаболизмът ти не работи и получи персонализиран 90-дневен план. Гаранция: плащаш 0 EUR.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#A50015',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${gilroy.variable} ${playfair.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-brand-bg">
        {children}

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
        </noscript>
      </body>
    </html>
  );
}
