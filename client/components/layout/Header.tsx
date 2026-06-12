'use client';

import { useAuthStore } from '@/store/auth.store';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Moon, Sun, LogOut, User, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { clearStoredRefreshToken } from '@/services/api-client';
import { ROUTES } from '@/constants/routes';

export function Header() {
  const { user, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const openMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Logout even if API fails
    } finally {
      clearAuth();
      clearStoredRefreshToken();
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-strong">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={openMobileSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo for mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg">BrainstormHub</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors cursor-pointer outline-none">
                  <UserAvatar name={user.name} avatar={user.avatar} size="md" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
