// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl =
    'https://my-dotnet-api.icysea-9e4aeb5a.polandcentral.azurecontainerapps.io/api/message';

  constructor(private http: HttpClient) {}

  fetchMessages(chatRoomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}?chatRoomId=${chatRoomId}`);
  }

  sendMessage(message: Message): Observable<Message> {
    console.log('Message', message);
    return this.http.post<Message>(`${this.apiUrl}/create`, message);
  }
}
