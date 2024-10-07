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

@Injectable()
export class CardService extends BaseService<CardRepository> {
  constructor(
    protected readonly repository: CardRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {
    super();
  }

  async reviewCard(cardId: string, grade: number): Promise<ICardDocument> {
    const card = (await this.repository.findById(cardId)) as ICardDocument;
    if (!card) {
      throw new HttpException(MessagesMapping['14'], HttpStatus.NOT_FOUND);
    }

    const now = new Date();

    const reviewLog = {
      rating: grade,
    };

    // Update the existing card with new information

    return await this.repository.save(card);
  }

  async getNextCard(user: Types.ObjectId): Promise<ICardDocument> {
    const cardDue = new Date();
    const nextCard = await this.repository.findOne({ due: cardDue });
    return nextCard;
  }

  // async update(
  //   cardId: Types.ObjectId | string,
  // ): Promise<ICardDocument> {
  //   const result = await this.repository.updateById(cardId, cardData);

  //   return result;
  // }

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
