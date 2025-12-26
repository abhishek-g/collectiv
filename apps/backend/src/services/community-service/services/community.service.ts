import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';
import {
  Community,
  CommunityMember,
  CommunityVisibility,
} from '../../../types';
import { pool } from '../../user-service/config/database';
import { AddMemberDto, CreateCommunityDto, UpdateCommunityDto } from '../dto/community.dto';

type CommunityRow = RowDataPacket & {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  visibility: CommunityVisibility;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
};

type CommunityMemberRow = RowDataPacket & {
  community_id: string;
  user_id: string;
  role: string;
  nickname: string | null;
  joined_at: Date;
};

export class CommunityService {
  private mapMembers(rows: CommunityMemberRow[]): CommunityMember[] {
    return rows.map((row) => ({
      userId: row.user_id,
      role: row.role as CommunityMember['role'],
      nickname: row.nickname ?? undefined,
      joinedAt: row.joined_at.toISOString(),
    }));
  }

  private mapCommunity(row: CommunityRow, members: CommunityMember[]): Community {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      imageUrl: row.image_url ?? undefined,
      visibility: row.visibility,
      ownerId: row.owner_id,
      members,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }

  private async fetchCommunity(id: string): Promise<Community> {
    const [communityRows] = await pool.query<CommunityRow[]>(
      'SELECT * FROM communities WHERE id = ?',
      [id]
    );
    if (!communityRows.length) {
      throw new Error('Community not found');
    }
    const communityRow = communityRows[0];

    const [memberRows] = await pool.query<CommunityMemberRow[]>(
      'SELECT * FROM community_members WHERE community_id = ?',
      [id]
    );
    return this.mapCommunity(communityRow, this.mapMembers(memberRows));
  }

  private async fetchCommunities(): Promise<Community[]> {
    const [communityRows] = await pool.query<CommunityRow[]>('SELECT * FROM communities');
    if (!communityRows.length) return [];

    const ids = communityRows.map((c) => c.id);
    const [memberRows] = await pool.query<CommunityMemberRow[]>(
      'SELECT * FROM community_members WHERE community_id IN (?)',
      [ids]
    );

    const memberMap = new Map<string, CommunityMember[]>();
    memberRows.forEach((row) => {
      const arr = memberMap.get(row.community_id) || [];
      arr.push({
        userId: row.user_id,
        role: row.role as CommunityMember['role'],
        nickname: row.nickname ?? undefined,
        joinedAt: row.joined_at.toISOString(),
      });
      memberMap.set(row.community_id, arr);
    });

    return communityRows.map((row) =>
      this.mapCommunity(row, memberMap.get(row.id) || [])
    );
  }

  async createCommunity(dto: CreateCommunityDto): Promise<Community> {
    const id = randomUUID();
    const visibility: CommunityVisibility = dto.visibility || 'public';
    const now = new Date();

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute(
        `INSERT INTO communities (id, name, description, visibility, owner_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, dto.name, dto.description ?? null, visibility, dto.ownerId, now, now]
      );

      await conn.execute(
        `INSERT INTO community_members (community_id, user_id, role, nickname, joined_at)
         VALUES (?, ?, 'owner', NULL, ?)`,
        [id, dto.ownerId, now]
      );

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }

    return this.fetchCommunity(id);
  }

  async listCommunities(): Promise<Community[]> {
    return this.fetchCommunities();
  }

  async getCommunity(id: string): Promise<Community> {
    return this.fetchCommunity(id);
  }

  async updateCommunity(id: string, dto: UpdateCommunityDto): Promise<Community> {
    await pool.execute(
      `UPDATE communities
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           image_url = COALESCE(?, image_url),
           visibility = COALESCE(?, visibility),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [dto.name ?? null, dto.description ?? null, (dto as any).imageUrl ?? null, dto.visibility ?? null, id]
    );

    return this.fetchCommunity(id);
  }

  async deleteCommunity(id: string): Promise<void> {
    const [result] = await pool.execute('DELETE FROM communities WHERE id = ?', [id]);
    const info = result as { affectedRows?: number };
    if (!info.affectedRows) {
      throw new Error('Community not found');
    }
  }

  async addMember(id: string, dto: AddMemberDto): Promise<Community> {
    // Ensure community exists
    const community = await this.fetchCommunity(id);
    if (community.members.some((m) => m.userId === dto.userId)) {
      throw new Error('Member already in community');
    }

    await pool.execute(
      `INSERT INTO community_members (community_id, user_id, role, nickname, joined_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, dto.userId, dto.role || 'member', null, new Date()]
    );

    return this.fetchCommunity(id);
  }

  async removeMember(id: string, userId: string): Promise<Community> {
    const [result] = await pool.execute(
      'DELETE FROM community_members WHERE community_id = ? AND user_id = ?',
      [id, userId]
    );
    const info = result as { affectedRows?: number };
    if (!info.affectedRows) {
      throw new Error('Member not found in community');
    }
    return this.fetchCommunity(id);
  }
}

export const communityService = new CommunityService();

