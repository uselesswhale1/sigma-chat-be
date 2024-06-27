import { IsNotEmpty, MaxLength } from "class-validator"

export class CreateMessageDto {
  @IsNotEmpty()
  @MaxLength(32)
  chatId: string;

  @IsNotEmpty()
  @MaxLength(512)
  content: string;

  @IsNotEmpty()
  @MaxLength(32)
  creator: string;
}
