import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReplyContactMessageDto {
  @IsNotEmpty()
  @IsUUID()
  messageId: string;

  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNotEmpty()
  @IsString()
  subject: string;
}
