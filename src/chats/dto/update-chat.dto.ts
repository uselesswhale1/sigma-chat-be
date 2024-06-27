export class UpdateChatDto {
  name?: string;
  invited?: string[];
  participants?: string[];

  photoUrl?: string;
  lastMessage?: string;
}
