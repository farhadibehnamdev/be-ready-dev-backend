import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordEntry, WordEntrySchema } from './models/wordEntry.entity';
import { WordEntryService } from './wordEntry.service';
import { WordEntryRepository } from './repositories/wordEntry.repository';
import { WordEntryController } from './wordEntry.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WordEntry.name, schema: WordEntrySchema },
    ]),
  ],
  providers: [WordEntryService, WordEntryRepository],
  controllers: [WordEntryController],
  exports: [WordEntryService, WordEntryRepository],
})
export class WordEntryModule {}
