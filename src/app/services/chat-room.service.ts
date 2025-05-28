import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private apiUrl =
    'https://my-dotnet-api.icysea-9e4aeb5a.polandcentral.azurecontainerapps.io/api/chatroom';

  constructor(private http: HttpClient, private userService: UserService) {}

  fetchChatRooms(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  processChatRoomNames(rooms: any[], currentUserName: string | null): any[] {
    return rooms.map((room) => {
      if (room.name.includes('|') && currentUserName) {
        const participants: string[] = room.name.split('|');
        const otherParticipant = participants.filter(
          (name: string) => name !== currentUserName
        );
        room.name = otherParticipant.join('');
      }
      return room;
    });
  }
}
