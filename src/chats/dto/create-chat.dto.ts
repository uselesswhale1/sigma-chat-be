import { IsNotEmpty, MaxLength, ArrayUnique, IsArray } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  @MaxLength(32)
  creator: string;

  @IsArray()
  @ArrayUnique({ each: true })
  invited: string[];

  photoUrl?: string;
}
