export class ChatEntity {
  name: string;
  creator: string;
  invited: string[];
  participants: string[];

  photoUrl?: string;
  lastMessage?: string;
}
