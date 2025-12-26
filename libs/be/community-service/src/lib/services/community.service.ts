import { randomUUID } from 'crypto';
import {
  Community,
  CommunityMember,
  CommunityVisibility,
} from '@nx-angular-express/shared';
import { AddMemberDto, CreateCommunityDto, UpdateCommunityDto } from '../dto/community.dto';

export class CommunityService {
  private communities = new Map<string, Community>();

  createCommunity(dto: CreateCommunityDto): Community {
    const id = randomUUID();
    const now = new Date().toISOString();
    const visibility: CommunityVisibility = dto.visibility || 'public';

    const ownerMember: CommunityMember = {
      userId: dto.ownerId,
      role: 'owner',
      joinedAt: now,
    };

    const community: Community = {
      id,
      name: dto.name,
      description: dto.description,
      visibility,
      ownerId: dto.ownerId,
      members: [ownerMember],
      createdAt: now,
      updatedAt: now,
    };

    this.communities.set(id, community);
    return community;
  }

  listCommunities(): Community[] {
    return Array.from(this.communities.values());
  }

  getCommunity(id: string): Community {
    const community = this.communities.get(id);
    if (!community) {
      throw new Error('Community not found');
    }
    return community;
  }

  updateCommunity(id: string, dto: UpdateCommunityDto): Community {
    const community = this.getCommunity(id);
    const updated: Community = {
      ...community,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.communities.set(id, updated);
    return updated;
  }

  deleteCommunity(id: string): void {
    if (!this.communities.delete(id)) {
      throw new Error('Community not found');
    }
  }

  addMember(id: string, dto: AddMemberDto): Community {
    const community = this.getCommunity(id);
    const exists = community.members.find((m) => m.userId === dto.userId);
    if (exists) {
      throw new Error('Member already in community');
    }
    const member: CommunityMember = {
      userId: dto.userId,
      role: dto.role || 'member',
      joinedAt: new Date().toISOString(),
    };
    const updated: Community = {
      ...community,
      members: [...community.members, member],
      updatedAt: new Date().toISOString(),
    };
    this.communities.set(id, updated);
    return updated;
  }

  removeMember(id: string, userId: string): Community {
    const community = this.getCommunity(id);
    const members = community.members.filter((m) => m.userId !== userId);
    if (members.length === community.members.length) {
      throw new Error('Member not found in community');
    }
    const updated: Community = {
      ...community,
      members,
      updatedAt: new Date().toISOString(),
    };
    this.communities.set(id, updated);
    return updated;
  }
}

export const communityService = new CommunityService();

