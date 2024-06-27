export class Message {
  id: string;
  content: string;
  creator: { fullName: string; photoUrl: string; id: number };
  chatId: string;
  createdAt: string;
  updatedAt: string;
}
