import { ListeningSessionStatusEnum } from '@shared/enums/listeningSessionStatus.enum';

export class UpdateListeningSessionDto {
  currentTime: number; // Current playhead position
  durationListened?: number; // Duration actually listened so far
  timeListened?: number; // Total elapsed time spent
  status?: ListeningSessionStatusEnum; // "playing", "paused", etc
  endedAt?: Date; // Session ended timestamp
}
