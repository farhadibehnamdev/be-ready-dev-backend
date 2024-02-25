import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranscriptRepository } from './repositories/transcript.repository';
import { Transcript, TranscriptSchema } from './models/transcript.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transcript.name, schema: TranscriptSchema },
    ]),
  ],
  providers: [TranscriptRepository],
  controllers: [],
  exports: [TranscriptRepository],
})
export class TranscriptModule {}
