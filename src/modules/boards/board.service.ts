import { Board } from './board.model';
import { ApiError } from '../../utils/apiError';
import { PaginationOptions, getPaginationMeta } from '../../utils/pagination';

/**
 * Board Service — business logic for board CRUD and archiving.
 */
export class BoardService {
  /** Create a new board in a workspace. */
  static async create(data: { title: string; description?: string; workspaceId: string }, userId: string) {
    const board = await Board.create({
      title: data.title,
      description: data.description || '',
      workspace: data.workspaceId,
      createdBy: userId,
    });
    return board.populate('createdBy', 'name email');
  }

  /** Get all boards in a workspace with pagination and optional archive filter. */
  static async getByWorkspace(
    workspaceId: string,
    pagination: PaginationOptions,
    includeArchived = false
  ) {
    const filter: any = { workspace: workspaceId };
    if (!includeArchived) filter.isArchived = false;

    const [boards, total] = await Promise.all([
      Board.find(filter)
        .populate('createdBy', 'name email')
        .sort({ updatedAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      Board.countDocuments(filter),
    ]);

    return { boards, pagination: getPaginationMeta(total, pagination) };
  }

  /** Get a board by ID. */
  static async getById(boardId: string) {
    const board = await Board.findById(boardId)
      .populate('createdBy', 'name email')
      .populate('workspace', 'name');
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }

  /** Update a board. */
  static async update(boardId: string, data: { title?: string; description?: string }) {
    const board = await Board.findByIdAndUpdate(boardId, data, { new: true, runValidators: true });
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }

  /** Archive a board (soft-hide). */
  static async archive(boardId: string) {
    const board = await Board.findByIdAndUpdate(
      boardId,
      { isArchived: true, archivedAt: new Date() },
      { new: true }
    );
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }

  /** Unarchive a board. */
  static async unarchive(boardId: string) {
    const board = await Board.findByIdAndUpdate(
      boardId,
      { isArchived: false, $unset: { archivedAt: '' } },
      { new: true }
    );
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }

  /** Permanently delete a board. */
  static async delete(boardId: string) {
    const board = await Board.findByIdAndDelete(boardId);
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }
}
