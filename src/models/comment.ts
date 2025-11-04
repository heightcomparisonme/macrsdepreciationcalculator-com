import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { Comment, CommentStatus, CommentFormData } from "@/types/comment";
import { eq, desc, asc, and, isNull } from "drizzle-orm";
import { getUuid } from "@/lib/hash";
import { getIsoTimestr } from "@/lib/time";

export const CommentStatusEnum = CommentStatus;

// Create new comment
export async function createComment(
  postUuid: string,
  data: CommentFormData,
  userUuid?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<Comment | null> {
  try {
    const commentUuid = getUuid();
    const now = getIsoTimestr();

    const commentData = {
      uuid: commentUuid,
      created_at: new Date(now),
      updated_at: new Date(now),
      status: CommentStatusEnum.Active,
      post_uuid: postUuid,
      user_uuid: userUuid || null,
      content: data.content.trim(),
      guest_name: data.guest_name?.trim() || null,
      guest_email: data.guest_email?.trim() || null,
      guest_website: data.guest_website?.trim() || null,
      parent_id: data.parent_id || null,
      reply_to_uuid: data.reply_to_uuid || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      is_approved: true, // Auto-approve for now
    };

    const result = await db().insert(comments).values(commentData).returning();

    if (result && result.length > 0) {
      return await getCommentByUuid(commentUuid);
    }

    return null;
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
}

// Get comment by UUID
export async function getCommentByUuid(uuid: string): Promise<Comment | null> {
  try {
    const result = await db()
      .select({
        comment: comments,
        author_name: users.nickname,
        author_avatar_url: users.avatar_url,
      })
      .from(comments)
      .leftJoin(users, eq(comments.user_uuid, users.uuid))
      .where(eq(comments.uuid, uuid))
      .limit(1);

    if (!result || result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      ...row.comment,
      author_name: row.author_name || row.comment.guest_name || "Anonymous",
      author_avatar_url: row.author_avatar_url || null,
    } as Comment;
  } catch (error) {
    console.error("Error getting comment by UUID:", error);
    return null;
  }
}

// Get comments for a post with replies
export async function getCommentsForPost(
  postUuid: string,
  page: number = 1,
  limit: number = 20
): Promise<{ comments: Comment[]; total: number }> {
  try {
    const offset = (page - 1) * limit;

    // Get top-level comments (no parent)
    const topLevelComments = await db()
      .select({
        comment: comments,
        author_name: users.nickname,
        author_avatar_url: users.avatar_url,
      })
      .from(comments)
      .leftJoin(users, eq(comments.user_uuid, users.uuid))
      .where(
        and(
          eq(comments.post_uuid, postUuid),
          eq(comments.status, CommentStatusEnum.Active),
          eq(comments.is_approved, true),
          isNull(comments.parent_id)
        )
      )
      .orderBy(desc(comments.created_at))
      .limit(limit)
      .offset(offset);

    // Get count of top-level comments
    const totalResult = await db()
      .select({ count: comments.id })
      .from(comments)
      .where(
        and(
          eq(comments.post_uuid, postUuid),
          eq(comments.status, CommentStatusEnum.Active),
          eq(comments.is_approved, true),
          isNull(comments.parent_id)
        )
      );

    const total = totalResult.length;

    // Get replies for each top-level comment
    const commentsWithReplies: Comment[] = [];

    for (const row of topLevelComments) {
      const comment: Comment = {
        ...row.comment,
        author_name: row.author_name || row.comment.guest_name || "Anonymous",
        author_avatar_url: row.author_avatar_url || null,
        replies: [],
      } as Comment;

      // Get replies for this comment
      const replies = await db()
        .select({
          comment: comments,
          author_name: users.nickname,
          author_avatar_url: users.avatar_url,
        })
        .from(comments)
        .leftJoin(users, eq(comments.user_uuid, users.uuid))
        .where(
          and(
            eq(comments.parent_id, comment.id),
            eq(comments.status, CommentStatusEnum.Active),
            eq(comments.is_approved, true)
          )
        )
        .orderBy(asc(comments.created_at));

      comment.replies = replies.map((replyRow) => ({
        ...replyRow.comment,
        author_name: replyRow.author_name || replyRow.comment.guest_name || "Anonymous",
        author_avatar_url: replyRow.author_avatar_url || null,
      })) as Comment[];

      commentsWithReplies.push(comment);
    }

    return {
      comments: commentsWithReplies,
      total,
    };
  } catch (error) {
    console.error("Error getting comments for post:", error);
    return { comments: [], total: 0 };
  }
}

// Update comment status
export async function updateCommentStatus(
  uuid: string,
  status: CommentStatus
): Promise<boolean> {
  try {
    const result = await db()
      .update(comments)
      .set({
        status,
        updated_at: new Date(getIsoTimestr()),
      })
      .where(eq(comments.uuid, uuid))
      .returning();

    return result && result.length > 0;
  } catch (error) {
    console.error("Error updating comment status:", error);
    return false;
  }
}

// Delete comment (soft delete)
export async function deleteComment(uuid: string): Promise<boolean> {
  return updateCommentStatus(uuid, CommentStatusEnum.Deleted);
}

// Get comment statistics for a post
export async function getCommentStats(postUuid: string): Promise<{
  total: number;
  approved: number;
  pending: number;
}> {
  try {
    const stats = await db()
      .select({
        status: comments.status,
        is_approved: comments.is_approved,
        count: comments.id,
      })
      .from(comments)
      .where(eq(comments.post_uuid, postUuid));

    const total = stats.length;
    const approved = stats.filter(s => s.status === CommentStatusEnum.Active && s.is_approved).length;
    const pending = stats.filter(s => s.status === CommentStatusEnum.Active && !s.is_approved).length;

    return { total, approved, pending };
  } catch (error) {
    console.error("Error getting comment stats:", error);
    return { total: 0, approved: 0, pending: 0 };
  }
}