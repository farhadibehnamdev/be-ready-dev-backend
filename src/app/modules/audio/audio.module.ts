import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AudioService } from './audio.service';
import { AudioRepository } from './repositories/audio.repository';
import { Audio, AudioSchema } from './models/audio.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }]),
  ],
  providers: [AudioService, AudioRepository],
  exports: [AudioService, AudioRepository],
})
export class AudioModule {}
