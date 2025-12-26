import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse, Community } from '@nx-angular-express/shared';

export interface CreateCommunityRequest {
  name: string;
  description?: string;
  visibility?: 'public' | 'private';
  imageUrl?: string;
}

export interface UpdateCommunityRequest {
  name?: string;
  description?: string;
  visibility?: 'public' | 'private';
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CommunitiesApi {
  private http = inject(HttpClient);

  list(): Observable<HttpResponse<Community[]>> {
    return this.http.get<HttpResponse<Community[]>>('/api/communities');
  }

  create(body: CreateCommunityRequest): Observable<HttpResponse<Community>> {
    return this.http.post<HttpResponse<Community>>('/api/communities', body);
  }

  get(id: string): Observable<HttpResponse<Community>> {
    return this.http.get<HttpResponse<Community>>(`/api/communities/${id}`);
  }

  update(id: string, body: UpdateCommunityRequest): Observable<HttpResponse<Community>> {
    return this.http.put<HttpResponse<Community>>(`/api/communities/${id}`, body);
  }

  addMember(id: string, userId: string, role: 'owner' | 'admin' | 'member' = 'member'): Observable<HttpResponse<Community>> {
    return this.http.post<HttpResponse<Community>>(`/api/communities/${id}/members`, { userId, role });
  }

  removeMember(id: string, userId: string): Observable<HttpResponse<Community>> {
    return this.http.delete<HttpResponse<Community>>(`/api/communities/${id}/members/${userId}`);
  }

  uploadImage(id: string, file: File): Observable<HttpResponse<Community>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<HttpResponse<Community>>(`/api/communities/${id}/image`, formData);
  }
}

