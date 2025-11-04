export interface Comment {
  id: number;
  uuid: string;
  created_at: Date;
  updated_at?: Date;
  status: CommentStatus;
  post_uuid: string;
  user_uuid?: string;
  content: string;
  // Guest fields
  guest_name?: string;
  guest_email?: string;
  guest_website?: string;
  // Reply fields
  parent_id?: number;
  reply_to_uuid?: string;
  // Moderation
  ip_address?: string;
  user_agent?: string;
  is_approved: boolean;
  // Computed fields
  author_name?: string;
  author_avatar_url?: string;
  replies?: Comment[];
}

export enum CommentStatus {
  Active = "active",
  Hidden = "hidden",
  Deleted = "deleted",
}

export interface CommentFormData {
  content: string;
  // Guest fields (optional)
  guest_name?: string;
  guest_email?: string;
  guest_website?: string;
  // Reply fields (optional)
  parent_id?: number;
  reply_to_uuid?: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}