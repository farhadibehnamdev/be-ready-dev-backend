import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListeningSessionDto {
  @IsString()
  @IsNotEmpty()
  userId;
  @IsString()
  @IsNotEmpty()
  podcastId;
  @IsString()
  @IsNotEmpty()
  episodeId;
}
