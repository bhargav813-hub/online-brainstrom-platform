'use client';

import { useQuery } from '@tanstack/react-query';
import { ideaService } from '@/services/idea.service';
import { sharedService } from '@/services/shared.service';
import { queryKeys } from '@/lib/queryKeys';
import { buildIdeaTree } from '@/lib/utils';
import { QUERY_CONFIG } from '@/constants/queryConfig';
import type { IdeaNode } from '@/types/models';

export function useIdeaTree(sessionId: string, shareToken?: string) {
  const query = useQuery({
    queryKey: shareToken
      ? ['shared', 'ideas', shareToken, sessionId]
      : queryKeys.ideas.hierarchy(sessionId),
    queryFn: () =>
      shareToken
        ? sharedService.getIdeasHierarchy(shareToken, sessionId)
        : ideaService.getHierarchy(sessionId),
    enabled: !!sessionId,
    staleTime: QUERY_CONFIG.staleTime.ideas,
    gcTime: QUERY_CONFIG.gcTime.ideas,
  });

  const tree: IdeaNode[] = query.data ? buildIdeaTree(query.data) : [];

  return {
    ...query,
    tree,
    flatIdeas: query.data ?? [],
  };
}
