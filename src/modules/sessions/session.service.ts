import { Session } from './session.model';
import { SessionParticipant } from './sessionParticipant.model';
import { ActivityLog } from '../activity/activity.model';
import { ApiError } from '../../utils/apiError';
import { SessionStatus, ActivityAction } from '../../types';
import { PaginationOptions, getPaginationMeta } from '../../utils/pagination';
import { User } from '../users/user.model';
import { Workspace } from '../workspaces/workspace.model';

/**
 * Session Service — brainstorming session lifecycle management.
 */
export class SessionService {
  /** Create a new brainstorming session. */
  static async create(
    data: {
      title: string;
      description?: string;
      boardId: string;
      workspaceId: string;
      maxParticipants?: number;
      settings?: any;
    },
    userId: string
  ) {
    const session = await Session.create({
      title: data.title,
      description: data.description || '',
      board: data.boardId,
      workspace: data.workspaceId,
      facilitator: userId,
      startedAt: new Date(),
      settings: data.settings || {},
      maxParticipants: data.maxParticipants,
    });

    // Automatically add the creator as a participant
    await SessionParticipant.create({
      session: session._id,
      user: userId,
      isActive: true,
    });

    // Log the activity
    await ActivityLog.create({
      session: session._id,
      user: userId,
      action: ActivityAction.SESSION_STARTED,
      targetType: 'Session',
      targetId: session._id,
    });

    return session.populate('facilitator', 'name email');
  }

  /** Get all sessions for a board with pagination. */
  static async getByBoard(boardId: string, pagination: PaginationOptions, status?: string) {
    const filter: any = { board: boardId };
    if (status) filter.status = status;

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .populate('facilitator', 'name email')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      Session.countDocuments(filter),
    ]);

    return { sessions, pagination: getPaginationMeta(total, pagination) };
  }

  /** Get session by ID with participant details. */
  static async getById(sessionId: string) {
    const session = await Session.findById(sessionId)
      .populate('facilitator', 'name email')
      .populate('board', 'title')
      .populate('workspace', 'name');

    if (!session) throw ApiError.notFound('Session not found');

    // Get active participants
    const participants = await SessionParticipant.find({
      session: sessionId,
      isActive: true,
    }).populate('user', 'name email avatar');

    const sessionObj = session.toObject();
    return {
      ...sessionObj,
      participants
    };
  }

  /** Update session (title, description, status). */
  static async update(sessionId: string, data: any, userId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw ApiError.notFound('Session not found');

    // If ending the session, set endedAt
    if (data.status === SessionStatus.ENDED) {
      data.endedAt = new Date();
      await ActivityLog.create({
        session: sessionId,
        user: userId,
        action: ActivityAction.SESSION_ENDED,
        targetType: 'Session',
        targetId: sessionId,
      });
    } else if (data.status === SessionStatus.PAUSED) {
      await ActivityLog.create({
        session: sessionId,
        user: userId,
        action: ActivityAction.SESSION_PAUSED,
        targetType: 'Session',
        targetId: sessionId,
      });
    }

    const updated = await Session.findByIdAndUpdate(sessionId, data, {
      new: true,
      runValidators: true,
    }).populate('facilitator', 'name email');

    return updated;
  }

  /** Join a session — creates a SessionParticipant record. */
  static async join(sessionId: string, userId: string) {
    const session = await Session.findById(sessionId);
    if (!session) throw ApiError.notFound('Session not found');

    if (session.status === SessionStatus.ENDED) {
      throw ApiError.badRequest('Cannot join an ended session');
    }

    // Check max participants
    if (session.maxParticipants) {
      const activeCount = await SessionParticipant.countDocuments({
        session: sessionId,
        isActive: true,
      });
      if (activeCount >= session.maxParticipants) {
        throw ApiError.badRequest('Session is full');
      }
    }

    // Check if user already has a record — reactivate if so
    let participant = await SessionParticipant.findOne({ session: sessionId, user: userId });

    if (participant) {
      participant.isActive = true;
      participant.joinedAt = new Date();
      participant.leftAt = undefined;
      await participant.save();
    } else {
      participant = await SessionParticipant.create({
        session: sessionId,
        user: userId,
        isActive: true,
      });
    }

    await ActivityLog.create({
      session: sessionId,
      user: userId,
      action: ActivityAction.USER_JOINED,
      targetType: 'Session',
      targetId: sessionId,
    });

    return participant;
  }

  /** Leave a session — marks participant as inactive. */
  static async leave(sessionId: string, userId: string) {
    const participant = await SessionParticipant.findOneAndUpdate(
      { session: sessionId, user: userId, isActive: true },
      { isActive: false, leftAt: new Date() },
      { new: true }
    );

    if (!participant) throw ApiError.notFound('Not an active participant');

    await ActivityLog.create({
      session: sessionId,
      user: userId,
      action: ActivityAction.USER_LEFT,
      targetType: 'Session',
      targetId: sessionId,
    });

    return participant;
  }

  /** Invite a user to a session by email — adds them as an active participant. */
  static async invite(sessionId: string, email: string, inviterUserId: string) {
    // Verify session exists and is not ended
    const session = await Session.findById(sessionId);
    if (!session) throw ApiError.notFound('Session not found');
    if (session.status === SessionStatus.ENDED) {
      throw ApiError.badRequest('Cannot invite to an ended session');
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw ApiError.notFound('No user found with that email address');

    // Verify the user is a member of the session's workspace
    const workspace = await Workspace.findOne({
      _id: session.workspace,
      'members.user': user._id,
    });
    if (!workspace) {
      throw ApiError.badRequest('User is not a member of this workspace. Add them to the workspace first.');
    }

    // Check max participants limit
    if (session.maxParticipants) {
      const activeCount = await SessionParticipant.countDocuments({
        session: sessionId,
        isActive: true,
      });
      if (activeCount >= session.maxParticipants) {
        throw ApiError.badRequest('Session has reached its maximum number of participants');
      }
    }

    // Upsert participant record
    let participant = await SessionParticipant.findOne({
      session: sessionId,
      user: user._id,
    });

    if (participant) {
      if (participant.isActive) {
        throw ApiError.conflict('User is already an active participant in this session');
      }
      participant.isActive = true;
      participant.joinedAt = new Date();
      participant.leftAt = undefined;
      await participant.save();
    } else {
      participant = await SessionParticipant.create({
        session: sessionId,
        user: user._id,
        isActive: true,
      });
    }

    await ActivityLog.create({
      session: sessionId,
      user: inviterUserId,
      action: ActivityAction.USER_JOINED,
      targetType: 'Session',
      targetId: sessionId,
      metadata: { invitedUser: user._id.toString(), invitedEmail: email },
    });

    return participant.populate('user', 'name email avatar');
  }

  /** Get session analytics — participant count, idea count, vote count. */
  static async getAnalytics(sessionId: string) {
    const [participantCount, totalParticipants, activityCount] = await Promise.all([
      SessionParticipant.countDocuments({ session: sessionId, isActive: true }),
      SessionParticipant.countDocuments({ session: sessionId }),
      ActivityLog.countDocuments({ session: sessionId }),
    ]);

    // Import here to avoid circular dependency
    const { Idea } = await import('../ideas/idea.model');
    const { Vote } = await import('../votes/vote.model');

    const [ideaCount, voteCount] = await Promise.all([
      Idea.countDocuments({ session: sessionId, isDeleted: false }),
      Vote.countDocuments({ session: sessionId }),
    ]);

    return {
      activeParticipants: participantCount,
      totalParticipants,
      ideas: ideaCount,
      votes: voteCount,
      activities: activityCount,
    };
  }
}
