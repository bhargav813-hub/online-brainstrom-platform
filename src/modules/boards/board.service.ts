import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import { Board } from './board.model';
import { ApiError } from '../../utils/apiError';
import { PaginationOptions, getPaginationMeta } from '../../utils/pagination';

/**
 * Board Service — business logic for board CRUD and archiving.
 */
export class BoardService {
  /** Create a new board in a workspace. */
  static async create(data: { name: string; description?: string; workspaceId: string }, userId: string) {
    const board = await Board.create({
      name: data.name,
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
  static async update(boardId: string, data: { name?: string; description?: string }) {
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

  /** Share a board publicly. */
  static async share(boardId: string) {
    const shareToken = crypto.randomUUID();
    const board = await Board.findByIdAndUpdate(
      boardId,
      { isPublic: true, shareToken },
      { new: true }
    );
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }

  /** Disable public sharing of a board. */
  static async unshare(boardId: string) {
    const board = await Board.findByIdAndUpdate(
      boardId,
      { isPublic: false, shareToken: null },
      { new: true }
    );
    if (!board) throw ApiError.notFound('Board not found');
    return board;
  }

  /** Get a publicly shared board by its token. */
  static async getShared(shareToken: string) {
    const board = await Board.findOne({ shareToken, isPublic: true })
      .populate('createdBy', 'name email')
      .populate('workspace', 'name');
    if (!board) throw ApiError.notFound('Shared board not found or private');

    const SessionModel = mongoose.model('Session');
    const IdeaModel = mongoose.model('Idea');

    // Find active or paused sessions (exclude ended sessions to keep view clean, or include all - let's include active/paused)
    const sessions = await SessionModel.find({ board: board._id, status: { $ne: 'ended' } }).sort({ createdAt: 1 });
    const sessionIds = sessions.map(s => s._id);

    const ideas = await IdeaModel.find({ session: { $in: sessionIds }, isDeleted: false })
      .populate('author', 'name email')
      .sort({ depth: 1, position: 1 });

    return { board, sessions, ideas };
  }

  /** Export board as PDF or JSON structure. */
  static async exportBoard(boardId: string, format: 'pdf' | 'json') {
    const board = await Board.findById(boardId)
      .populate('createdBy', 'name email')
      .populate('workspace', 'name');
    if (!board) throw ApiError.notFound('Board not found');

    const SessionModel = mongoose.model('Session');
    const IdeaModel = mongoose.model('Idea');

    const sessions = await SessionModel.find({ board: board._id }).sort({ createdAt: 1 });
    const sessionIds = sessions.map(s => s._id);

    const ideas = await IdeaModel.find({ session: { $in: sessionIds }, isDeleted: false })
      .populate('author', 'name email')
      .sort({ depth: 1, position: 1 });

    if (format === 'json') {
      return {
        board: {
          id: board._id,
          name: board.name,
          description: board.description,
          workspace: board.workspace,
          createdBy: board.createdBy,
          createdAt: board.createdAt,
        },
        sessions: sessions.map(s => ({
          id: s._id,
          title: s.title,
          description: s.description,
          status: s.status,
          createdAt: s.createdAt,
        })),
        ideas: ideas.map((i: any) => ({
          id: i._id,
          title: i.title,
          content: i.content,
          session: i.session,
          author: i.author,
          parentIdea: i.parentIdea,
          depth: i.depth,
          position: i.position,
          tags: i.tags,
          upvoteCount: i.upvoteCount,
          downvoteCount: i.downvoteCount,
        })),
      };
    }

    // PDF Generation using PDFKit
    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    // Styles
    const primaryColor = '#1e293b'; 
    const secondaryColor = '#475569'; 
    const accentColor = '#3b82f6'; 
    const textColor = '#0f172a'; 

    // Header Title
    doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold').text(board.name);
    if (board.description) {
      doc.moveDown(0.3);
      doc.fillColor(secondaryColor).fontSize(12).font('Helvetica-Oblique').text(board.description);
    }
    
    doc.moveDown(0.5);
    doc.fillColor(secondaryColor).fontSize(10).font('Helvetica').text(`Workspace: ${(board.workspace as any)?.name || 'N/A'}`);
    doc.text(`Created By: ${(board.createdBy as any)?.name || 'N/A'} (${(board.createdBy as any)?.email || 'N/A'})`);
    doc.text(`Exported On: ${new Date().toLocaleString()}`);
    
    doc.moveDown(0.8);
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    if (sessions.length === 0) {
      doc.fillColor(textColor).fontSize(12).font('Helvetica').text('No sessions found on this board.');
    } else {
      for (const session of sessions) {
        doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text(`Session: ${session.title}`);
        if (session.description) {
          doc.moveDown(0.2);
          doc.fillColor(secondaryColor).fontSize(10).font('Helvetica').text(session.description);
        }
        doc.moveDown(0.2);
        doc.fillColor(secondaryColor).fontSize(9).font('Helvetica-Bold').text(`Status: ${session.status.toUpperCase()}`);
        doc.moveDown(0.5);

        const sessionIdeas = ideas.filter((i: any) => i.session.toString() === session._id.toString());

        if (sessionIdeas.length === 0) {
          doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Oblique').text('No ideas brainstormed in this session yet.', { indent: 20 });
          doc.moveDown(1.5);
        } else {
          const rootIdeas = sessionIdeas.filter((i: any) => !i.parentIdea);
          
          const renderIdea = (idea: any, indentLevel: number) => {
            const indent = indentLevel * 20 + 20;
            
            if (doc.y > 700) {
              doc.addPage();
            }

            const prefix = indentLevel === 0 ? '• ' : '↳ ';
            
            doc.fillColor(textColor).fontSize(11).font('Helvetica-Bold');
            doc.text(`${prefix}${idea.title}`, 50 + indent, doc.y, { continued: true });
            
            const authorName = (idea.author as any)?.name || 'Anonymous';
            doc.fillColor(secondaryColor).fontSize(9).font('Helvetica');
            doc.text(` (by ${authorName})`, { continued: true });

            doc.fillColor(accentColor).fontSize(9).font('Helvetica-Bold');
            doc.text(` [+${idea.upvoteCount} / -${idea.downvoteCount}]`, { continued: false });

            if (idea.content) {
              doc.fillColor(textColor).fontSize(9.5).font('Helvetica');
              doc.text(idea.content, 50 + indent + 10, doc.y + 2);
            }

            if (idea.tags && idea.tags.length > 0) {
              doc.fillColor(secondaryColor).fontSize(8).font('Helvetica-Oblique');
              doc.text(`Tags: ${idea.tags.join(', ')}`, 50 + indent + 10, doc.y + 1);
            }

            doc.moveDown(0.5);

            const children = sessionIdeas.filter((i: any) => i.parentIdea && i.parentIdea.toString() === idea._id.toString());
            children.sort((a: any, b: any) => a.position - b.position);

            for (const child of children) {
              renderIdea(child, indentLevel + 1);
            }
          };

          for (const rootIdea of rootIdeas) {
            renderIdea(rootIdea, 0);
          }
          
          doc.moveDown(1.0);
        }

        if (sessions.indexOf(session) < sessions.length - 1) {
          doc.strokeColor('#f1f5f9').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
          doc.moveDown(1.0);
        }
      }
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fillColor(secondaryColor).fontSize(8).font('Helvetica');
      doc.text(
        `Page ${i + 1} of ${range.count}`,
        50,
        750,
        { align: 'center', width: 500 }
      );
    }

    doc.end();
    return doc;
  }
}
