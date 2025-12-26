import { CommunityVisibility, CommunityRole } from '../../../../../../libs/shared/src/index';

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

