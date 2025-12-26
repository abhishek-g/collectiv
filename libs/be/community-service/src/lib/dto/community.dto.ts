import { CommunityVisibility, CommunityRole } from '@nx-angular-express/shared';

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
}

export interface AddMemberDto {
  userId: string;
  role?: CommunityRole;
}

