export type CommunityId = string;
export type UserId = string;

export type CommunityVisibility = 'public' | 'private';

export type CommunityRole = 'owner' | 'admin' | 'member';

export interface CommunityMember {
  userId: UserId;
  role: CommunityRole;
  joinedAt: string; // ISO date string
  nickname?: string;
}

export interface Community {
  id: CommunityId;
  name: string;
  description?: string;
  visibility: CommunityVisibility;
  ownerId: UserId;
  members: CommunityMember[];
  imageUrl?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

