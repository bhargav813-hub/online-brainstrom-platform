'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  xs: 'h-5 w-5 text-[8px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function UserAvatar({ name, avatar, className, size = 'md' }: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
