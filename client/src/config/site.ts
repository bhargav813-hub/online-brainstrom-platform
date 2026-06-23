export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Brainstorm Platform',
  description:
    'Collaborative real-time brainstorming with hierarchical ideas, structured voting, and intelligent clustering.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    github: '#',
  },
};
