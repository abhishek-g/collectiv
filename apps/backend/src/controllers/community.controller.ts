import { Request, Response } from 'express';
import { communityService, CreateCommunityDto, UpdateCommunityDto, AddMemberDto } from '../services/community-service';
import { HttpResponse, Community } from '../types';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import path from 'path';

const isOwnerOrAdmin = (community: Community, userId: string): boolean => {
  if (community.ownerId === userId) return true;
  return community.members.some((m) => m.userId === userId && m.role === 'admin');
};

const isOwner = (community: Community, userId: string): boolean => community.ownerId === userId;

const resolveImageUrl = (req: Request, imageUrl?: string): string | undefined => {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}${imageUrl}`;
};

const withImage = (req: Request, community: Community): Community => ({
  ...community,
  imageUrl: resolveImageUrl(req, community.imageUrl),
});

class CommunityController {
  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized', statusCode: 401 });
        return;
      }
      const dto: CreateCommunityDto = {
        ...req.body,
        ownerId: userId,
      };
      const community = await communityService.createCommunity(dto);
      const response: HttpResponse<Community> = {
        success: true,
        data: withImage(req, community),
        statusCode: 201,
        message: 'Community created',
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error?.message || 'Failed to create community',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  };

  list = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    const communities = await communityService.listCommunities();
    const formatted = communities.map((c) => withImage(res.req, c));
    const response: HttpResponse<typeof communities> = {
      success: true,
      data: formatted,
      statusCode: 200,
    };
    res.status(200).json(response);
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const community = await communityService.getCommunity(req.params.id);
      const response: HttpResponse<Community> = {
        success: true,
        data: withImage(req, community),
        statusCode: 200,
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error?.message || 'Community not found',
        statusCode: 404,
      };
      res.status(404).json(response);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized', statusCode: 401 });
        return;
      }
      const community = await communityService.getCommunity(req.params.id);
      if (!isOwnerOrAdmin(community, userId)) {
        res.status(403).json({ success: false, error: 'Forbidden', statusCode: 403 });
        return;
      }
      const dto: UpdateCommunityDto = req.body;
      const updated = await communityService.updateCommunity(req.params.id, dto);
      const response: HttpResponse<Community> = {
        success: true,
        data: withImage(req, updated),
        statusCode: 200,
        message: 'Community updated',
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error?.message || 'Failed to update community',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized', statusCode: 401 });
        return;
      }
      const community = await communityService.getCommunity(req.params.id);
      if (!isOwner(community, userId)) {
        res.status(403).json({ success: false, error: 'Only owner can delete community', statusCode: 403 });
        return;
      }
      await communityService.deleteCommunity(req.params.id);
      const response: HttpResponse<null> = {
        success: true,
        statusCode: 200,
        message: 'Community deleted',
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error?.message || 'Failed to delete community',
        statusCode: 404,
      };
      res.status(404).json(response);
    }
  };

  addMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized', statusCode: 401 });
        return;
      }
      const community = await communityService.getCommunity(req.params.id);
      if (!isOwnerOrAdmin(community, userId)) {
        res.status(403).json({ success: false, error: 'Forbidden', statusCode: 403 });
        return;
      }
      const dto: AddMemberDto = req.body;
      const updated = await communityService.addMember(req.params.id, dto);
      const response: HttpResponse<Community> = {
        success: true,
        data: withImage(req, updated),
        statusCode: 200,
        message: 'Member added',
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error?.message || 'Failed to add member',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  };

  removeMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const actingUser = req.user?.userId;
      if (!actingUser) {
        res.status(401).json({ success: false, error: 'Unauthorized', statusCode: 401 });
        return;
      }
      const { userId } = req.params;
      const community = await communityService.getCommunity(req.params.id);
      if (!isOwnerOrAdmin(community, actingUser)) {
        res.status(403).json({ success: false, error: 'Forbidden', statusCode: 403 });
        return;
      }
      const updated = await communityService.removeMember(req.params.id, userId);
      const response: HttpResponse<Community> = {
        success: true,
        data: withImage(req, updated),
        statusCode: 200,
        message: 'Member removed',
      };
      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error?.message || 'Failed to remove member',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  };

  uploadImage = [
    upload.single('image'),
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
        const actingUser = req.user?.userId;
        if (!actingUser) {
          res.status(401).json({ success: false, error: 'Unauthorized', statusCode: 401 });
          return;
        }
        const community = await communityService.getCommunity(req.params.id);
        if (!isOwner(community, actingUser)) {
          res.status(403).json({ success: false, error: 'Only owner can update image', statusCode: 403 });
          return;
        }

        if (!req.file) {
          res.status(400).json({ success: false, error: 'Image file is required', statusCode: 400 });
          return;
        }

        const relativePath = path.join('/assets/community-images', req.file.filename);
        const updated = await communityService.updateCommunity(req.params.id, { imageUrl: relativePath });
        const response: HttpResponse<Community> = {
          success: true,
          data: withImage(req, updated),
          statusCode: 200,
          message: 'Community image updated',
        };
        res.status(200).json(response);
      } catch (error: any) {
        const response: HttpResponse<null> = {
          success: false,
          error: error?.message || 'Failed to update image',
          statusCode: 400,
        };
        res.status(400).json(response);
      }
    },
  ];
}

const communityController = new CommunityController();
export default communityController;

