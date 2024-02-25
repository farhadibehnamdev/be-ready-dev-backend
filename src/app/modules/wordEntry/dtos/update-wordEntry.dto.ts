import { PartialType } from '@nestjs/swagger';
import { CreateWordEntryDto } from './create-wordEntry.dto';

export class UpdateWordEntryDto extends PartialType(CreateWordEntryDto) {}
