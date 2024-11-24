import { Comment, SUBSCRIPTION_PLAN } from "@prisma/client";

export type VideoType = {
  id: string;
  createdAt: Date;
  source: string;
  title: string;
  processing: boolean;
  user: {
    image: string | null;
    firstname: string | null;
    lastname: string | null;
  };
  workspace: {
    name: string;
  };
  folder: {
    id: string;
    name: string;
  };
};

export type PreviewVideoType = {
  id?: string | undefined;
  workspaceId?: string | undefined;
  createdAt?: Date | undefined;
  source?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  views?: number | undefined;
  summery?: string | null;
  processing?: boolean | undefined;
  user?: {
    subscription: {
      plan: SUBSCRIPTION_PLAN;
    } | null;
    id: string;
    clerkId: string;
    image: string | null;
    firstname: string | null;
    lastname: string | null;
    trial: boolean;
  };
  author: boolean;
};

export type CommentType = Comment & {
  user: {
    image: string | null;
    firstname: string | null;
    lastname: string | null;
  };
};
