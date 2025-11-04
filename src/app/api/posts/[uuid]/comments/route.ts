import { NextRequest } from "next/server";
import { getCommentsForPost, createComment } from "@/models/comment";
import { findPostByUuid } from "@/models/post";
import { getClientIp } from "@/lib/ip";
import { auth } from "@/auth";
import { respData, respErr } from "@/lib/resp";

// GET /api/posts/[uuid]/comments - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid: postUuid } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Verify post exists
    const post = await findPostByUuid(postUuid);
    if (!post) {
      return respErr("Post not found");
    }

    // Get comments
    const { comments, total } = await getCommentsForPost(postUuid, page, limit);

    return respData({
      comments,
      total,
      page,
      limit,
      hasMore: total > page * limit,
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    return respErr("Internal server error");
  }
}

// POST /api/posts/[uuid]/comments - Create new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid: postUuid } = await params;
    const body = await request.json();

    // Verify post exists
    const post = await findPostByUuid(postUuid);
    if (!post) {
      return respErr("Post not found");
    }

    // Validate required fields
    if (!body.content || typeof body.content !== "string" || !body.content.trim()) {
      return respErr("Comment content is required");
    }

    // Get user info if authenticated
    const session = await auth();
    const user = session?.user as {uuid?: string} | undefined;

    // If user is not authenticated, require guest info
    if (!user) {
      if (!body.guest_name || !body.guest_email) {
        return respErr("Name and email are required for guest comments");
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.guest_email)) {
        return respErr("Valid email is required");
      }
    }

    // Get client info
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";

    // Create comment
    const comment = await createComment(
      postUuid,
      {
        content: body.content,
        guest_name: body.guest_name,
        guest_email: body.guest_email,
        guest_website: body.guest_website,
        parent_id: body.parent_id,
        reply_to_uuid: body.reply_to_uuid,
      },
      user?.uuid,
      ipAddress,
      userAgent
    );

    if (!comment) {
      return respErr("Failed to create comment");
    }

    return respData({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return respErr("Internal server error");
  }
}