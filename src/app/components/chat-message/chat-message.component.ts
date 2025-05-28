import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { User } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/models/Message';
import { MessageService } from 'src/app/services/message.service';
import { SignalRService } from 'src/app/services/signalr.service';
import {
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatMessageComponent implements OnInit, OnChanges {
  @Input() chatRoomId!: number;

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: Message[] = [];
  userId: string | null = null;
  newMessageContent: string = '';

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.userService.userId$.subscribe((id) => {
      if (id) {
        this.userId = id;
        console.log('this.userId in chat-message', this.userId);
      }
    });

    if (this.chatRoomId) {
      this.fetchMessages();
    }

    this.signalRService.on(
      'ReceiveMessage',
      (senderUserId, content, sentAt) => {
        const newMessage: Message = {
          messageId: 0,
          chatRoomId: this.chatRoomId,
          senderUserId,
          content,
          sentAt,
        };
        this.messages.push(newMessage);
        this.scrollToBottom();
      }
    );
    //this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    //this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatRoomId'] && changes['chatRoomId'].currentValue != null) {
      const idStr = this.chatRoomId.toString();
      console.log('chat room Ids:', idStr);

      this.signalRService
        .joinGroup(idStr)
        .catch((err) => console.error('Error joining group:', err));

      this.fetchMessages();
    }
  }

  fetchMessages(): void {
    this.messageService.fetchMessages(this.chatRoomId).subscribe(
      (data) => {
        this.messages = data;
        console.log('messages for chat room', this.messages);
        this.scrollToBottom(); //
      },
      (error) => {
        console.error('Error fetching messages', error);
      }
    );
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim()) return;

    const message: Message = {
      messageId: 0,
      chatRoomId: this.chatRoomId,
      senderUserId: +this.userId!,
      content: this.newMessageContent.trim(),
      sentAt: new Date().toISOString(),
    };

    this.messageService.sendMessage(message).subscribe(
      (savedMessage) => {
        //this.messages.push(savedMessage);
        this.newMessageContent = '';
      },
      (error) => console.error('Error sending message', error)
    );
  }
  formatTime(sentAt: string): string {
    const date = new Date(sentAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  isSender(message: Message): boolean {
    return message.senderUserId.toString() == this.userId;
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (err) {
      console.error('Auto-scroll failed', err);
    }
  }
}
