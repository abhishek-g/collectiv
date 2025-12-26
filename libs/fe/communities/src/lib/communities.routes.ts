import { Route } from '@angular/router';
import { communityResolver } from './resolvers/community.resolver';
import { CommunitiesPageComponent } from './containers/communities-page/communities-page.component';
import { CommunityDetailPageComponent } from './containers/community-detail-page/community-detail-page.component';
import { CreateCommunityPageComponent } from './containers/create-community-page/create-community-page.component';
import { EditCommunityPageComponent } from './containers/edit-community-page/edit-community-page.component';

export const communitiesRoutes: Route[] = [
  {
    path: '',
    component: CommunitiesPageComponent,
  },
  {
    path: 'create',
    component: CreateCommunityPageComponent,
  },
  {
    path: ':id',
    resolve: { community: communityResolver },
    component: CommunityDetailPageComponent,
  },
  {
    path: ':id/edit',
    resolve: { community: communityResolver },
    component: EditCommunityPageComponent,
  },
  {
    path: ':id/members',
    resolve: { community: communityResolver },
    component: CommunityDetailPageComponent,
  },
  {
    path: ':id/tournaments',
    resolve: { community: communityResolver },
    component: CommunityDetailPageComponent,
  },
  {
    path: ':id/chat',
    resolve: { community: communityResolver },
    component: CommunityDetailPageComponent,
  },
];

