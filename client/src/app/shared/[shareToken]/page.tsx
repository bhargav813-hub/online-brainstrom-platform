'use client';

import { use } from 'react';
import { useSharedBoard } from '@/features/boards/hooks/useBoard';
import { PageLoader } from '@/components/feedback/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Globe, Lock, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import Link from 'next/link';

export default function SharedBoardPage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = use(params);
  const { data: sharedData, isLoading, error } = useSharedBoard(shareToken);

  if (isLoading) return <PageLoader />;

  if (error || !sharedData || !sharedData.board) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Board Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            This shared board link is invalid or the board is no longer public.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            ← Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  const board = sharedData.board;
  const sessions = sharedData.sessions || [];
  const ideas = sharedData.ideas || [];
  const creator = typeof board.createdBy === 'object' ? board.createdBy : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Brainstorm
            </span>
          </Link>
          <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 dark:border-emerald-800">
            <Globe className="h-3 w-3" />
            Public Board
          </Badge>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{board.name}</h1>
            {board.description && (
              <p className="mt-2 text-lg text-muted-foreground">{board.description}</p>
            )}
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              {creator && <span>Created by {creator.name}</span>}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelativeTime(board.createdAt)}
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Board Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="mt-1 font-semibold">
                    {board.isArchived ? (
                      <Badge variant="secondary">Archived</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
                    )}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                  <p className="mt-1 font-semibold">
                    <Badge className="gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This board is shared publicly. Sign in or create an account to participate in brainstorming sessions.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            </CardContent>
          </Card>

          {sessions.length > 0 && (
            <div className="space-y-6 pt-6 border-t">
              <h2 className="text-2xl font-bold">Brainstorming Sessions</h2>
              {sessions.map((session) => {
                const sessionIdeas = ideas.filter((i) => i.session === session._id);
                return (
                  <Card key={session._id} className="border-muted bg-muted/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">{session.status}</Badge>
                      </div>
                      {session.description && <p className="text-sm text-muted-foreground mt-1">{session.description}</p>}
                    </CardHeader>
                    <CardContent>
                      {sessionIdeas.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                          No ideas brainstormed in this session yet.
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {sessionIdeas.map((idea) => (
                            <div key={idea._id} className="rounded-lg border bg-background p-4 shadow-sm">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-medium text-sm leading-tight">{idea.title}</h3>
                                <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium">
                                  <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">+{idea.upvoteCount || 0}</span>
                                  <span className="text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded">-{idea.downvoteCount || 0}</span>
                                </div>
                              </div>
                              {idea.content && <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{idea.content}</p>}
                              <div className="flex items-center justify-between mt-auto pt-2 border-t border-muted/50">
                                <div className="text-[10px] text-muted-foreground">
                                  By <span className="font-medium text-foreground">{typeof idea.author === 'object' && idea.author !== null && 'name' in idea.author ? idea.author.name : 'Anonymous'}</span>
                                </div>
                                {idea.tags && idea.tags.length > 0 && (
                                  <div className="flex gap-1 flex-wrap justify-end">
                                    {idea.tags.map((tag: string) => (
                                      <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0 h-4">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
