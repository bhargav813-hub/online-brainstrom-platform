'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            aria-describedby={error ? errorId : undefined}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
            {...register}
          />
        ))}
      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
