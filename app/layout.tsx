import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Enterprise AI Knowledge & Support Copilot',
  description:
    'Search organizational knowledge, ask questions with RAG-powered citations, and manage enterprise documents.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 dark:bg-slate-950 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
