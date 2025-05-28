import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Message } from '../../models/Message';

interface CreateChatRoomResponse {
  roomId: number;
  chatRoomId: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  onlineUsers: string[] = [];
  currentUser: string | null = null;
  userId: string | null = null;

  @Output() refreshChatRooms = new EventEmitter<number>();

  constructor(
    private signalRService: SignalRService,
    private userService: UserService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.signalRService.initializeConnection().then(() => {
      this.signalRService.on('UpdateOnlineUsers', (users: string[]) => {
        console.log('users', users);
        this.onlineUsers = users;
      });

      this.signalRService
        .invoke('GetOnlineUsers')
        .catch((err) => console.error('Error invoking GetOnlineUsers:', err));
    });

    this.userService.userId$.subscribe((id) => {
      this.userId = id;
      //console.log('User ID in Dashboard:', this.userId);
    });

    this.userService.fetchUserName();
    this.userService.userName$.subscribe((name) => {
      this.currentUser = name;
      //console.log('User Name in Dashboard:', this.currentUser);
    });
  }

  startChat(user: string): void {
    const chatRoomName = `${this.currentUser}|${user}`;
    const createRoomRequest = {
      Name: chatRoomName,
      CreatedByUserId: this.userId,
    };

    this.http
      .post<CreateChatRoomResponse>(
        'https://my-dotnet-api.icysea-9e4aeb5a.polandcentral.azurecontainerapps.io/api/ChatRoom/create',
        createRoomRequest
      )
      .subscribe({
        next: (response) => {
          //console.log('Chat room created successfully:', response.roomId);

          const message: Message = {
            messageId: 0,
            chatRoomId: response.roomId,
            senderUserId: +this.userId!,
            content: `${this.currentUser} wants to say hi!`,
            sentAt: new Date().toISOString(),
          };

          //console.log('message', message);

          this.messageService.sendMessage(message).subscribe(
            () => {
              window.location.reload();
            },
            (error) => {
              console.error('Error sending message', error);
            }
          );
        },
        error: (error) => {
          console.error('Error creating chat room:', error);
        },
      });
  }
}
