'use client';

import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';
import { sharedService } from '@/services/shared.service';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/constants/queryConfig';
import type { ActivityAction } from '@/types/common';

export function useActivity(sessionId: string, page = 1, limit = 20, shareToken?: string) {
  return useQuery({
    queryKey: shareToken
      ? ['shared', 'activity', shareToken, sessionId, page]
      : [...queryKeys.activity.bySession(sessionId), page],
    queryFn: () =>
      shareToken
        ? sharedService.getActivityTimeline(shareToken, sessionId, page, limit)
        : activityService.getBySession(sessionId, page, limit),
    enabled: !!sessionId,
    staleTime: QUERY_CONFIG.staleTime.activity,
  });
}

export function useFilteredActivity(sessionId: string, action: ActivityAction, page = 1) {
  return useQuery({
    queryKey: queryKeys.activity.filtered(sessionId, action),
    queryFn: () => activityService.getFiltered(sessionId, action, page),
    enabled: !!sessionId && !!action,
    staleTime: QUERY_CONFIG.staleTime.activity,
  });
}

export function useUserActivity(sessionId: string, userId: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.activity.byUser(sessionId, userId),
    queryFn: () => activityService.getByUser(sessionId, userId, page),
    enabled: !!sessionId && !!userId,
    staleTime: QUERY_CONFIG.staleTime.activity,
  });
}
