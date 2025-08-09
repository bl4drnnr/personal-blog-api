export interface UserMessageData {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface SendReplyToUserInterface {
  to: string;
  userMessage: UserMessageData;
  reply: string;
  subject: string;
}
