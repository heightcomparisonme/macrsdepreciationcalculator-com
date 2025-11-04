"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Comment, CommentListResponse } from "@/types/comment";
import { MessageCircle, RefreshCw } from "lucide-react";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";
import { toast } from "sonner";

interface CommentsProps {
  postUuid: string;
}

export default function Comments({ postUuid }: CommentsProps) {
  const t = useTranslations();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const limit = 10;

  const fetchComments = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `/api/posts/${postUuid}/comments?page=${pageNum}&limit=${limit}`
      );

      const result = await response.json();

      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || "Failed to fetch comments");
      }

      const data = result.data;

      if (append) {
        setComments((prev) => [...prev, ...data.comments]);
      } else {
        setComments(data.comments);
      }

      setTotal(data.total);
      setHasMore(data.hasMore || false);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(t("comments.fetch_error"));
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchComments(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComments(1, false);
  };

  const handleCommentSubmitted = () => {
    // Refresh comments from the beginning
    fetchComments(1, false);
  };

  useEffect(() => {
    fetchComments();
  }, [postUuid]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t("comments.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading skeletons */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t("comments.title")} ({total})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment form */}
        <CommentForm postUuid={postUuid} onCommentSubmitted={handleCommentSubmitted} />

        {/* Comments list */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("comments.all_comments")} ({total})
              </h3>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.uuid}
                    comment={comment}
                    postUuid={postUuid}
                    onCommentSubmitted={handleCommentSubmitted}
                  />
                ))}
              </div>
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-32"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t("comments.loading")}
                    </>
                  ) : (
                    t("comments.load_more")
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("comments.no_comments")}</p>
              <p className="text-sm">{t("comments.be_first")}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}