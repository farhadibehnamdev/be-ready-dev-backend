import { PartialType } from '@nestjs/swagger';
import { WordEntry } from '../models/wordEntry.entity';

export class VocabularyFlashcardDto extends PartialType(WordEntry) {}
