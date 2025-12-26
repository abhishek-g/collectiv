import { Request, Response } from 'express';
import { communityService, CreateCommunityDto, UpdateCommunityDto, AddMemberDto } from '@nx-angular-express/community-service';
import { HttpResponse } from '@nx-angular-express/shared';

class CommunityController {
  create = (req: Request, res: Response): void => {
    try {
      const dto: CreateCommunityDto = req.body;
      const community = communityService.createCommunity(dto);
      const response: HttpResponse<typeof community> = {
        success: true,
        data: community,
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

  list = (_req: Request, res: Response): void => {
    const communities = communityService.listCommunities();
    const response: HttpResponse<typeof communities> = {
      success: true,
      data: communities,
      statusCode: 200,
    };
    res.status(200).json(response);
  };

  getById = (req: Request, res: Response): void => {
    try {
      const community = communityService.getCommunity(req.params.id);
      const response: HttpResponse<typeof community> = {
        success: true,
        data: community,
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

  update = (req: Request, res: Response): void => {
    try {
      const dto: UpdateCommunityDto = req.body;
      const community = communityService.updateCommunity(req.params.id, dto);
      const response: HttpResponse<typeof community> = {
        success: true,
        data: community,
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

  remove = (req: Request, res: Response): void => {
    try {
      communityService.deleteCommunity(req.params.id);
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

  addMember = (req: Request, res: Response): void => {
    try {
      const dto: AddMemberDto = req.body;
      const community = communityService.addMember(req.params.id, dto);
      const response: HttpResponse<typeof community> = {
        success: true,
        data: community,
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

  removeMember = (req: Request, res: Response): void => {
    try {
      const { userId } = req.params;
      const community = communityService.removeMember(req.params.id, userId);
      const response: HttpResponse<typeof community> = {
        success: true,
        data: community,
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
}

const communityController = new CommunityController();
export default communityController;

