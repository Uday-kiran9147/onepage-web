import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReadOnePage — Your Digital Home on the Internet',
  description:
    'Create a premium, minimal, and fast single-page digital home. Show who you are, what you build, and how to contact you in 60 seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

