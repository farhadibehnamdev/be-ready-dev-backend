import { Types } from 'mongoose';

import { ImageService } from '@modules/image/image.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import { CreateCardDto } from './dtos/create-card.dto';
import { ICardDocument } from './interfaces/card.interface';
import { CardRepository } from './repositories/card.repository';
import { Card } from './models/card.entity';
import { CardInput, FSRS } from 'ts-fsrs';
import { getTime } from 'date-fns';

@Injectable()
export class CardService extends BaseService<CardRepository> {
  private fsrs: FSRS;

  constructor(
    protected readonly repository: CardRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {
    super();
    this.fsrs = new FSRS({ enable_fuzz: true });
  }

  async reviewCard(cardId: string, grade: number): Promise<ICardDocument> {
    const card = (await this.repository.findById(cardId)) as ICardDocument;
    if (!card) {
      throw new HttpException(MessagesMapping['14'], HttpStatus.NOT_FOUND);
    }

    const now = new Date();
    const elapsedDays = card.last_review
      ? (now.getTime() - card.last_review.getTime()) / (1000 * 3600 * 24)
      : 0;

    const reviewLog = {
      rating: grade,
      state: card.state,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: elapsedDays,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
    };

    const schedulingInfo = this.fsrs.repeat(reviewLog, new Date());
    const { card: updatedCardInfo } = schedulingInfo[grade];

    // Update the existing card with new information
    card.state = updatedCardInfo.state;
    card.due = new Date(
      now.getTime() + updatedCardInfo.scheduled_days * 24 * 3600 * 1000,
    );
    card.stability = updatedCardInfo.stability;
    card.difficulty = updatedCardInfo.difficulty;
    card.elapsed_days = elapsedDays;
    card.scheduled_days = updatedCardInfo.scheduled_days;
    card.reps += 1;
    card.lapses = updatedCardInfo.lapses;
    card.last_review = now;
    return await this.repository.save(updatedCardInfo);
  }

  async getNextCard(): Promise<ICardDocument> {
    const cardDue = new Date();
    const nextCard = await this.repository.find({ due: cardDue });
    return nextCard;
  }

  async update(
    cardId: Types.ObjectId | string,
    data: CardInput,
  ): Promise<ICardDocument> {
    const result = await this.repository.updateById(cardId, data);

    return result;
  }

  async create(createCardDto: CreateCardDto): Promise<ICardDocument> {
    const result = await this.repository.create(createCardDto);

    return result;
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<ICardDocument> {
    const Card = await this.findById(id);

    if (Card.image) {
      const image = await this.imageService.findById(Card.image);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);
    }

    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      Card._id,
      file.buffer,
      {
        path: `images/categories`,
      },
    );

    const imageDoc = await this.imageService.create(aws);

    Card.image = imageDoc._id;

    await Card.save();

    return Card;
  }

  async deleteById(id: string | Types.ObjectId): Promise<ICardDocument> {
    const result = await this.repository.deleteById(id);

    if (!result) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    if (result.image) {
      const image = await this.imageService.findById(result.image);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);

      result.image = undefined;
    }

    return result;
  }
}
