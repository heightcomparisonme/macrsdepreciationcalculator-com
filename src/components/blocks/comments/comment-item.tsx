"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/comment";
import { MessageCircle, Clock } from "lucide-react";
import moment from "moment";
import CommentForm from "./comment-form";

interface CommentItemProps {
  comment: Comment;
  postUuid: string;
  level?: number;
  onCommentSubmitted?: () => void;
}

export default function CommentItem({
  comment,
  postUuid,
  level = 0,
  onCommentSubmitted,
}: CommentItemProps) {
  const t = useTranslations();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const maxLevel = 3; // Maximum nesting level for replies
  const canReply = level < maxLevel;

  const handleReplySubmitted = () => {
    setShowReplyForm(false);
    onCommentSubmitted?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getWebsiteLink = (website: string) => {
    if (!website) return "";
    // Add protocol if missing
    if (!/^https?:\/\//i.test(website)) {
      return `https://${website}`;
    }
    return website;
  };

  return (
    <div className={`space-y-4 ${level > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={comment.author_avatar_url || ""}
            alt={comment.author_name || "Anonymous"}
          />
          <AvatarFallback className="text-sm">
            {getInitials(comment.author_name || "Anonymous")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Author info */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {comment.guest_website ? (
              <a
                href={getWebsiteLink(comment.guest_website)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {comment.author_name}
              </a>
            ) : (
              <span className="font-medium">{comment.author_name}</span>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <time dateTime={comment.created_at.toString()}>
                {moment(comment.created_at).fromNow()}
              </time>
            </div>
          </div>

          {/* Comment content */}
          <div className="prose prose-sm max-w-none mb-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Action buttons */}
          {canReply && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-7 px-2 text-xs"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                {t("comments.reply")}
              </Button>

              {comment.replies && comment.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-7 px-2 text-xs"
                >
                  {showReplies ? t("comments.hide_replies") : t("comments.show_replies")}{" "}
                  ({comment.replies.length})
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <CommentForm
          postUuid={postUuid}
          parentId={comment.id}
          replyToUuid={comment.uuid}
          replyToAuthor={comment.author_name}
          onCommentSubmitted={handleReplySubmitted}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && showReplies && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.uuid}
              comment={reply}
              postUuid={postUuid}
              level={level + 1}
              onCommentSubmitted={onCommentSubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
}