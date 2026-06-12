import type { ReactNode } from 'react';
import Link from 'next/link';
import { Globe, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Public Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-heading text-lg font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            BrainstormHub
          </Link>
          <Badge variant="outline" className="flex items-center gap-1 text-[10px] py-0 px-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
            <Globe className="h-3 w-3" /> Guest Access (Read-Only)
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lock className="h-3 w-3" /> Secure View-only mode
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
