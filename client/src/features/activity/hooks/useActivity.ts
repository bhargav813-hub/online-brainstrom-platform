'use client';

import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';
import { queryKeys } from '@/constants/query-keys';

export function useActivity(sessionId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.activity.bySession(sessionId), page],
    queryFn: () => activityService.getBySession(sessionId, page, limit),
    enabled: !!sessionId,
  });
}

export function useFilteredActivity(sessionId: string, action: string) {
  return useQuery({
    queryKey: queryKeys.activity.filtered(sessionId, action),
    queryFn: () => activityService.getFiltered(sessionId, action),
    enabled: !!sessionId && !!action,
  });
}
