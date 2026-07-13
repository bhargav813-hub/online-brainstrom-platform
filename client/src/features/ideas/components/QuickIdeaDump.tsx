import { useState, useEffect } from 'react';
import { Plus, Lightbulb, Loader2, Save, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { workspaceService } from '@/services/workspace.service';
import { boardService } from '@/services/board.service';
import { sessionService } from '@/services/session.service';
import { ideaService } from '@/services/idea.service';
import type { Workspace } from '@/types/workspace.types';
import type { Board } from '@/types/board.types';
import type { Session } from '@/types/session.types';
import { toast } from 'sonner';
import { useDraftStore } from '@/store/draft.store';

export function QuickIdeaDump() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Data state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  
  // Loading states
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Drafts state
  const { drafts, addDraft, removeDraft } = useDraftStore();
  const [activeTab, setActiveTab] = useState('new');

  const loadWorkspaces = async () => {
    try {
      setIsLoadingWorkspaces(true);
      const data = await workspaceService.getAll();
      setWorkspaces(data);
    } catch {
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoadingWorkspaces(false);
    }
  };

  // Fetch workspaces on open
  useEffect(() => {
    if (isOpen && workspaces.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadWorkspaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadBoards = async (wsId: string) => {
    try {
      setIsLoadingBoards(true);
      const data = await boardService.getByWorkspace(wsId);
      setBoards(data);
    } catch {
      toast.error('Failed to load boards');
    } finally {
      setIsLoadingBoards(false);
    }
  };

  // Fetch boards when workspace changes
  useEffect(() => {
    if (selectedWorkspaceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadBoards(selectedWorkspaceId);
    }
  }, [selectedWorkspaceId]);

  const loadSessions = async (bId: string) => {
    try {
      setIsLoadingSessions(true);
      const response = await sessionService.getByBoard(bId);
      setSessions(response.data);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Fetch sessions when board changes
  useEffect(() => {
    if (selectedBoardId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSessions(selectedBoardId);
    }
  }, [selectedBoardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!selectedSessionId) {
      // Save as draft
      addDraft({ title, content });
      toast.success('Idea saved as draft!');
      setTitle('');
      setContent('');
      setActiveTab('drafts');
      return;
    }

    try {
      setIsSubmitting(true);
      await ideaService.create({
        title,
        content,
        sessionId: selectedSessionId,
      });
      toast.success('Idea saved to session!');
      setTitle('');
      setContent('');
      // Keep panel open in case they want to add more, or close it:
      // setIsOpen(false);
    } catch {
      toast.error('Failed to save idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePushDraft = async (draftId: string, draftTitle: string, draftContent: string) => {
    if (!selectedSessionId) {
      toast.error('Please select a session first');
      return;
    }
    try {
      setIsSubmitting(true);
      await ideaService.create({
        title: draftTitle,
        content: draftContent,
        sessionId: selectedSessionId,
      });
      toast.success('Draft pushed to session!');
      removeDraft(draftId);
    } catch {
      toast.error('Failed to push draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl shadow-violet-500/30 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:scale-105 animate-bounce transition-all duration-300 z-50 p-0"
        size="icon"
      >
        <Lightbulb className="h-7 w-7 text-white" />
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-5 sm:px-6 pt-6 pb-2">
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb className="h-6 w-6 text-violet-600" />
              Quick Idea
            </SheetTitle>
            <SheetDescription>
              Capture ideas instantly. Save them as drafts or push directly to an active session.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1 overflow-hidden min-h-0 space-y-3 px-5 sm:px-6">
            {/* Location Selection - Always visible at top */}
            <div className="rounded-lg bg-muted/20 p-3 border border-border shadow-sm flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Target Session {selectedSessionId ? '(Selected)' : '(Optional for Draft)'}
                </h3>
                {selectedWorkspaceId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1.5 text-[10px] uppercase text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSelectedWorkspaceId('');
                      setSelectedBoardId('');
                      setSelectedSessionId('');
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <Label className="w-16 text-xs text-muted-foreground shrink-0 text-right">Workspace</Label>
                  <Select 
                    value={selectedWorkspaceId} 
                    onValueChange={(val) => {
                      setSelectedBoardId('');
                      setSelectedSessionId('');
                      setSessions([]);
                      
                      if (val === 'none' || !val) {
                        setSelectedWorkspaceId('');
                        setBoards([]);
                      } else {
                        setSelectedWorkspaceId(val);
                      }
                    }} 
                    disabled={isLoadingWorkspaces}
                  >
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder={isLoadingWorkspaces ? 'Loading...' : 'Select a workspace'}>
                      {workspaces.find(ws => ws._id === selectedWorkspaceId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-muted-foreground italic">-- Clear selection --</SelectItem>
                    {workspaces.map(ws => (
                      <SelectItem key={ws._id} value={ws._id}>{ws.name}</SelectItem>
                    ))}
                    {workspaces.length === 0 && !isLoadingWorkspaces && (
                      <div className="p-2 text-sm text-muted-foreground text-center">No workspaces found</div>
                    )}
                  </SelectContent>
                </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="w-16 text-xs text-muted-foreground shrink-0 text-right">Board</Label>
                  <Select 
                    value={selectedBoardId} 
                    onValueChange={(val) => {
                      setSelectedSessionId('');
                      if (val === 'none' || !val) {
                        setSelectedBoardId('');
                        setSessions([]);
                      } else {
                        setSelectedBoardId(val);
                      }
                    }} 
                    disabled={!selectedWorkspaceId || isLoadingBoards}
                  >
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder={isLoadingBoards ? 'Loading...' : 'Select a board'}>
                      {boards.find(b => b._id === selectedBoardId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-muted-foreground italic">-- Clear selection --</SelectItem>
                    {boards.map(board => (
                      <SelectItem key={board._id} value={board._id}>{board.name}</SelectItem>
                    ))}
                    {boards.length === 0 && !isLoadingBoards && (
                      <div className="p-2 text-sm text-muted-foreground text-center">No boards found</div>
                    )}
                  </SelectContent>
                </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Label className="w-16 text-xs text-muted-foreground shrink-0 text-right">Session</Label>
                  <Select 
                    value={selectedSessionId} 
                    onValueChange={(val) => {
                      if (val === 'none') {
                        setSelectedSessionId('');
                      } else {
                        setSelectedSessionId(val || '');
                      }
                    }} 
                    disabled={!selectedBoardId || isLoadingSessions}
                  >
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder={isLoadingSessions ? 'Loading...' : 'Select a session'}>
                      {sessions.find(s => s._id === selectedSessionId)?.title}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-muted-foreground italic">-- Clear selection --</SelectItem>
                    {sessions.map(session => (
                      <SelectItem 
                        key={session._id} 
                        value={session._id}
                        disabled={session.status === 'ended'}
                      >
                        {session.title} {session.status === 'ended' && <span className="text-muted-foreground text-xs ml-2">(Ended)</span>}
                      </SelectItem>
                    ))}
                    {sessions.length === 0 && !isLoadingSessions && (
                      <div className="p-2 text-sm text-muted-foreground text-center">No sessions found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>

            {/* Tabs for New Idea / Drafts */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2 mb-2 flex-shrink-0">
                <TabsTrigger value="new">New Idea</TabsTrigger>
                <TabsTrigger value="drafts">My Drafts ({drafts.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new" className="flex-1 overflow-y-auto outline-none pr-2">
                <form id="idea-form" onSubmit={handleSubmit} className="space-y-3 pt-1 pb-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="idea-title" className="text-sm font-medium">Idea Title <span className="text-destructive">*</span></Label>
                    <Input
                      id="idea-title"
                      placeholder="What's your idea?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="h-10 border-input shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="idea-content" className="text-sm font-medium text-muted-foreground">Details <span className="font-normal opacity-70">(Optional)</span></Label>
                    <Textarea
                      id="idea-content"
                      placeholder="Add more context..."
                      className="min-h-[100px] resize-none border-input shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="drafts" className="flex-1 overflow-y-auto outline-none pr-1">
                <div className="space-y-3 pt-2">
                  {drafts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <Lightbulb className="h-8 w-8 mx-auto mb-3 opacity-20" />
                      No drafts saved yet.
                    </div>
                  ) : (
                    drafts.map((draft) => (
                      <div key={draft.id} className="p-3 border rounded-lg bg-card shadow-sm space-y-2">
                        <h4 className="font-medium text-sm">{draft.title}</h4>
                        {draft.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{draft.content}</p>
                        )}
                        <div className="flex gap-2 justify-end pt-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeDraft(draft.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-8 bg-violet-600 hover:bg-violet-700 text-white"
                            disabled={!selectedSessionId || isSubmitting}
                            onClick={() => handlePushDraft(draft.id, draft.title, draft.content)}
                          >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            Push to Session
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SheetFooter className="px-5 sm:px-6 pb-6 pt-4 mt-auto flex-shrink-0 flex-row gap-3 sm:justify-between w-full">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            {activeTab === 'new' && (
              <Button 
                type="submit" 
                form="idea-form"
                className={`flex-1 ${!selectedSessionId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'} text-white`}
                disabled={!title.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : !selectedSessionId ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {!selectedSessionId ? 'Save as Draft' : 'Save to Session'}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
