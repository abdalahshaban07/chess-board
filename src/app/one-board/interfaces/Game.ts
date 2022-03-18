import { Member } from './Member';

export interface Game {
  status: string;
  members: Member[];
  gameId: string;
  winner?: string;
  isGameOver?: boolean;
  gameData?: string;
}
