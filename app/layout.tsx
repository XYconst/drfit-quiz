import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans, Playfair_Display, Geist_Mono } from 'next/font/google';
import { META_PIXEL_ID } from '@/lib/pixel';
import './globals.css';

// Gilroy is paid; Plus Jakarta Sans is the closest free family with the full
// weight range (200–800). Swap to a local Gilroy when a licensed copy is
// dropped into public/fonts/.
const sans = Plus_Jakarta_Sans({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-sans-runtime',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
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
    <html lang="bg" className={`${sans.variable} ${playfair.variable} ${geistMono.variable}`}>
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
