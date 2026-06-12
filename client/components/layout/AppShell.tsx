'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
