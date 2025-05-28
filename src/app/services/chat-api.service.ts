import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private baseUrl = `${environment.apiUrl}/ChatRoom`;

  constructor(private http: HttpClient) {}

  createRoom(name: string, createdByUserId: number) {
    return this.http.post(`${this.baseUrl}/create`, { name, createdByUserId });
  }

  getMessages(chatRoomId: number) {
    return this.http.get(`${environment.apiUrl}/Message?chatRoomId=${chatRoomId}`);
  }
}
