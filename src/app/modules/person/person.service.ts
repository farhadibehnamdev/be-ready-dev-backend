import { Types } from 'mongoose';

import { ImageService } from '@modules/image/image.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';
import { PersonRepository } from './repositories/person.repository';
import { CreatePersonDto } from './dtos/create-person.dto';
import { IPersonDocument } from './interfaces/person.interface';

@Injectable()
export class PersonService extends BaseService<PersonRepository> {
  constructor(
    protected readonly repository: PersonRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly imageService: ImageService,
  ) {
    super();
  }

  async create(createPersonDto: CreatePersonDto): Promise<IPersonDocument> {
    const result = await this.repository.create(createPersonDto);

    return result;
  }

  async uploadImage(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IPersonDocument> {
    const Person = await this.findById(id);

    if (Person.image) {
      const image = await this.imageService.findById(Person.image);

      await this.awsService.s3DeleteItemInBucket(image.pathWithFilename);

      await this.imageService.deleteById(image._id);
    }

    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      Person._id,
      file.buffer,
      {
        path: `images/categories`,
      },
    );

    const imageDoc = await this.imageService.create(aws);

    Person.image = imageDoc._id;

    await Person.save();

    return Person;
  }

  async deleteById(id: string | Types.ObjectId): Promise<IPersonDocument> {
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
