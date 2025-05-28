export interface Message {
  messageId: number;
  chatRoomId: number;
  senderUserId: number;
  content: string;
  sentAt: string;
}
