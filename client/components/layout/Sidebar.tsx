'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';
import {
  Zap,
  LayoutDashboard,
  FolderKanban,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Workspaces', href: ROUTES.WORKSPACES, icon: LayoutDashboard },
  { label: 'Profile', href: ROUTES.PROFILE, icon: FolderKanban },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-border/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-lg glow-sm flex-shrink-0">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {isSidebarOpen && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold text-lg tracking-tight whitespace-nowrap">
              Brainstorm<span className="gradient-text">Hub</span>
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              !isSidebarOpen && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm glow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom branding */}
      {isSidebarOpen && (
        <div className="border-t border-border/50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Collaborative Ideation</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { isSidebarOpen } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen for the custom event dispatched by Header's hamburger button
  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener('toggle-mobile-sidebar', handler);
    return () => window.removeEventListener('toggle-mobile-sidebar', handler);
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-64' : 'w-[68px]'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
