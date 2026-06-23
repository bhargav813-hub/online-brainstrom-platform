'use client';

import { Badge } from '@/components/ui/badge';
import { ROLE_DISPLAY_NAMES, ROLE_COLORS, type UserRole } from '@/constants/roles';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn('font-medium', ROLE_COLORS[role], className)}
      aria-label={`Role: ${ROLE_DISPLAY_NAMES[role]}`}
    >
      {ROLE_DISPLAY_NAMES[role]}
    </Badge>
  );
}
