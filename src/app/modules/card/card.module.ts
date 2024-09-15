import { ImageModule } from '@modules/image/image.module';
import { forwardRef, Module } from '@nestjs/common';
import { AwsModule } from '@shared/aws/aws.module';

import { ICardDocument } from './interfaces/card.interface';
import { Card, CardSchema } from './models/card.entity';
import { CardRepository } from './repositories/card.repository';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [forwardRef(() => AwsModule), forwardRef(() => ImageModule)],
  providers: [CardService, CardRepository],
  controllers: [CardController],
  exports: [CardRepository, CardService],
})
export class CardModule {}
