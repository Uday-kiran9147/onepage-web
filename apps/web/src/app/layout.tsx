import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mirror — Anonymous Personal Growth Feedback',
  description:
    'Get honest, anonymous feedback from people in your circle. See patterns in your habits, attitude, and personality. Real growth starts with real feedback.',
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
