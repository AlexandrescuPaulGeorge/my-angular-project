import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../services/user.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChatMessageComponent } from '../components/chat-message/chat-message.component';
import { ChatRoomComponent } from '../components/chat-room/chat-room.component';
import { UserListComponent } from '../components/user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    ChatMessageComponent,
    ChatRoomComponent,
    UserListComponent,
    CommonModule,
  ],
})
export class DashboardComponent implements OnInit {
  title = 'chat-frontend';
  isLoginOrRegisterPage: boolean = false;
  userId: string | null = null;
  userName: string | null = null;
  selectedChatRoomId!: number;

  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginOrRegisterPage =
          event.url === '/login' || event.url === '/register';
      });

    this.userService.fetchUserId();

    this.userService.userId$.subscribe((id) => {
      this.userId = id;
    });
  }

  onChatRoomSelected(chatRoomId: number): void {
    this.selectedChatRoomId = chatRoomId;
    //console.log('Selected Chat Room ID:', chatRoomId);
  }

  handleNewChatRoom(roomId: number): void {
    this.selectedChatRoomId = roomId;
    //console.log('New Chat Room ID handled in Dashboard:', roomId);
  }

  onChatRoomCreated(newRoomId: number): void {
    this.selectedChatRoomId = newRoomId;
    //console.log('New chat room added:', newRoomId);
  }
}
