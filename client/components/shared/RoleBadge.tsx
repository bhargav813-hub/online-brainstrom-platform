import { Badge } from '@/components/ui/badge';
import { ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';
import type { UserRole } from '@/types/common';
import { cn } from '@/lib/utils';
import { Shield, Eye, Users, Crown } from 'lucide-react';

const roleIcons: Record<UserRole, React.ReactNode> = {
  participant: <Users className="h-3 w-3" />,
  reviewer: <Eye className="h-3 w-3" />,
  facilitator: <Shield className="h-3 w-3" />,
  workspace_admin: <Crown className="h-3 w-3" />,
};

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({ role, showIcon = true, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 font-medium text-xs', ROLE_COLORS[role], className)}
    >
      {showIcon && roleIcons[role]}
      {ROLE_LABELS[role]}
    </Badge>
  );
}
