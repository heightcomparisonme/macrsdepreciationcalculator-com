"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentFormData } from "@/types/comment";
import { toast } from "sonner";

interface CommentFormProps {
  postUuid: string;
  parentId?: number;
  replyToUuid?: string;
  replyToAuthor?: string;
  onCommentSubmitted?: () => void;
  onCancel?: () => void;
}

export default function CommentForm({
  postUuid,
  parentId,
  replyToUuid,
  replyToAuthor,
  onCommentSubmitted,
  onCancel,
}: CommentFormProps) {
  const { data: session } = useSession();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CommentFormData>({
    content: "",
    guest_name: "",
    guest_email: "",
    guest_website: "",
  });

  const isReply = parentId && replyToUuid;
  const isAuthenticated = !!session?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error(t("comments.content_required"));
      return;
    }

    if (!isAuthenticated) {
      if (!formData.guest_name?.trim() || !formData.guest_email?.trim()) {
        toast.error(t("comments.guest_info_required"));
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        content: formData.content.trim(),
        parent_id: parentId,
        reply_to_uuid: replyToUuid,
        guest_name: !isAuthenticated ? formData.guest_name : undefined,
        guest_email: !isAuthenticated ? formData.guest_email : undefined,
        guest_website: !isAuthenticated ? formData.guest_website : undefined,
      };

      const response = await fetch(`/api/posts/${postUuid}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || "Failed to submit comment");
      }

      toast.success(t("comments.submitted_successfully"));

      // Reset form
      setFormData({
        content: "",
        guest_name: "",
        guest_email: "",
        guest_website: "",
      });

      onCommentSubmitted?.();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(error instanceof Error ? error.message : t("comments.submit_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={isReply ? "ml-8 mt-4" : ""}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {isReply
            ? t("comments.reply_to", { author: replyToAuthor })
            : t("comments.leave_comment")
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest information fields (only show if not authenticated) */}
          {!isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest_name" className="required">
                  {t("comments.name")} *
                </Label>
                <Input
                  id="guest_name"
                  type="text"
                  value={formData.guest_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, guest_name: e.target.value }))
                  }
                  placeholder={t("comments.name_placeholder")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guest_email" className="required">
                  {t("comments.email")} *
                </Label>
                <Input
                  id="guest_email"
                  type="email"
                  value={formData.guest_email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, guest_email: e.target.value }))
                  }
                  placeholder={t("comments.email_placeholder")}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="guest_website">
                  {t("comments.website")} ({t("comments.optional")})
                </Label>
                <Input
                  id="guest_website"
                  type="url"
                  value={formData.guest_website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, guest_website: e.target.value }))
                  }
                  placeholder={t("comments.website_placeholder")}
                />
              </div>
            </div>
          )}

          {/* Comment content */}
          <div>
            <Label htmlFor="content" className="required">
              {t("comments.comment")} *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder={t("comments.comment_placeholder")}
              rows={isReply ? 3 : 5}
              required
            />
          </div>

          {/* Submit buttons */}
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("comments.submitting") : t("comments.submit")}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("comments.cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}