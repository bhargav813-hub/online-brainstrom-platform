import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/5 blur-[120px]" />
      <div className="relative w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
