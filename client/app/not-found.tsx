import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Ghost, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Ghost className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold font-heading">404</h1>
          <p className="text-lg text-muted-foreground mt-2">
            This page doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href={ROUTES.HOME}>
            <Button variant="outline" className="gap-1.5">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
          <Link href={ROUTES.WORKSPACES}>
            <Button className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Go to Workspaces
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
