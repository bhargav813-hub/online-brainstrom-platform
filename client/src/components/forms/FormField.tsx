'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children?: React.ReactNode;
  className?: string;
  id: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
}

export function FormField({
  label,
  error,
  children,
  className,
  id,
  type = 'text',
  placeholder,
  multiline,
  register,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children ||
        (multiline ? (
          <Textarea
            id={id}
            placeholder={placeholder}
            aria-describedby={error ? errorId : undefined}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
            {...register}
          />
        ) : (
          <div className="relative">
            <Input
              id={id}
              type={isPassword && showPassword ? 'text' : type}
              placeholder={placeholder}
              aria-describedby={error ? errorId : undefined}
              className={cn(error && 'border-destructive focus-visible:ring-destructive', isPassword && 'pr-10')}
              {...register}
            />
            {isPassword && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            )}
          </div>
        ))}
      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
