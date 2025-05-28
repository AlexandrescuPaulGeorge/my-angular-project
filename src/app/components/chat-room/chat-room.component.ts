import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ChatRoomService } from 'src/app/services/chat-room.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {
  chatRooms: any[] = [];
  userId: string | null = null;
  currentUserName: string | null = null;

  @Input() selectedChatRoomId!: number;
  @Output() chatRoomSelected = new EventEmitter<number>();

  constructor(
    private userService: UserService,
    private chatRoomService: ChatRoomService
  ) {}

  ngOnInit(): void {
    this.userService.userId$.subscribe((id) => {
      if (id) {
        this.userId = id;
        this.fetchChatRooms();
      }
    });

    this.userService.userName$.subscribe((name) => {
      this.currentUserName = name;
    });
  }

  fetchChatRooms(): void {
    if (!this.userId) {
      console.warn('User ID is not set');
      return;
    }

    this.chatRoomService.fetchChatRooms(this.userId).subscribe(
      (data: any[]) => {
        this.chatRooms = this.chatRoomService.processChatRoomNames(
          data,
          this.currentUserName
        );
        console.log(this.chatRooms);
      },
      (error: any) => {
        console.error('Error fetching chat rooms', error);
      }
    );
  }

  openChatRoom(room: any): void {
    this.chatRoomSelected.emit(room.chatRoomId);
  }

  getMessageTime(sentAt: string): string {
    const now = new Date();
    const messageDate = new Date(sentAt);
    const today = formatDate(now, 'yyyy-MM-dd', 'en');
    const yesterday = formatDate(
      new Date(now.setDate(now.getDate() - 1)),
      'yyyy-MM-dd',
      'en'
    );
    const messageDay = formatDate(messageDate, 'yyyy-MM-dd', 'en');

    if (messageDay === today) {
      const diffInHours = Math.floor(
        (new Date().getTime() - messageDate.getTime()) / (1000 * 60 * 60)
      );
      return diffInHours > 0 ? `${diffInHours}h ago` : 'Just now';
    } else if (messageDay === yesterday) {
      return 'Yesterday';
    } else {
      return formatDate(messageDate, 'MMM-dd', 'en');
    }
  }

  refreshAndSelectNewChatRoom(newRoomId: number): void {
    this.fetchChatRooms();
    setTimeout(() => {
      this.chatRoomSelected.emit(newRoomId);
    }, 500);
  }
  onChatRoomCreated(newRoomId: number): void {
    this.chatRooms.push({ chatRoomId: newRoomId, name: 'New Chat Room' });
    this.chatRoomSelected.emit(newRoomId);
  }
}
