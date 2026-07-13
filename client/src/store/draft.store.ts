import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DraftIdea {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface DraftState {
  drafts: DraftIdea[];
  addDraft: (draft: Omit<DraftIdea, 'id' | 'createdAt'>) => void;
  removeDraft: (id: string) => void;
  clearDrafts: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      drafts: [],
      addDraft: (draft) => set((state) => ({
        drafts: [
          {
            ...draft,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...state.drafts,
        ],
      })),
      removeDraft: (id) => set((state) => ({
        drafts: state.drafts.filter((d) => d.id !== id),
      })),
      clearDrafts: () => set({ drafts: [] }),
    }),
    {
      name: 'brainstorm-drafts', // Key in localStorage
    }
  )
);
