import { CommunityVisibility, CommunityRole } from '../../../types';

export interface CreateCommunityDto {
  name: string;
  description?: string;
  visibility?: CommunityVisibility;
  ownerId: string;
}

export interface UpdateCommunityDto {
  name?: string;
  description?: string;
  visibility?: CommunityVisibility;
  imageUrl?: string;
}

export interface AddMemberDto {
  userId: string;
  role?: CommunityRole;
}

