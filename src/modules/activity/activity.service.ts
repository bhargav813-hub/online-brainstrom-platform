import { ActivityLog } from './activity.model';
import { PaginationOptions, getPaginationMeta } from '../../utils/pagination';

/**
 * Activity Service — fetches session timelines and activity logs.
 */
export class ActivityService {
  /** Get activity timeline for a session. */
  static async getSessionTimeline(sessionId: string, pagination: PaginationOptions) {
    const filter = { session: sessionId };

    const [activities, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      ActivityLog.countDocuments(filter),
    ]);

    return { activities, pagination: getPaginationMeta(total, pagination) };
  }

  /** Get activity logs filtered by action type. */
  static async getByAction(sessionId: string, action: string, pagination: PaginationOptions) {
    const filter: any = { session: sessionId };
    if (action) filter.action = action;

    const [activities, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      ActivityLog.countDocuments(filter),
    ]);

    return { activities, pagination: getPaginationMeta(total, pagination) };
  }

  /** Get activity for a specific user in a session. */
  static async getUserActivity(sessionId: string, userId: string, pagination: PaginationOptions) {
    const filter = { session: sessionId, user: userId };

    const [activities, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      ActivityLog.countDocuments(filter),
    ]);

    return { activities, pagination: getPaginationMeta(total, pagination) };
  }
}
