import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BrainstormHub — Collaborative Ideation Platform',
  description:
    'Structured online brainstorming with hierarchical ideas, real-time collaboration, and powerful voting.',
  openGraph: {
    title: 'BrainstormHub',
    description: 'Structured online brainstorming with hierarchical ideas, real-time collaboration, and powerful voting.',
    url: 'https://brainstormhub.com',
    siteName: 'BrainstormHub',
    type: 'website',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
