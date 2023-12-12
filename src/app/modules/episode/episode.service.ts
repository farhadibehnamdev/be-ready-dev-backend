import { Types } from 'mongoose';
import slugify from 'slugify';

import { CategoryService } from '@modules/category/category.service';
import { TagService } from '@modules/tag/tag.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '@shared/aws/aws.service';
import { IAwsS3Response } from '@shared/aws/interfaces/aws.interface';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';

import {
  IEpisodeAudio,
  IEpisodeDocument,
} from './interfaces/episode.interface';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { EpisodeRepository } from './repositories/episode.repository';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { AudioService } from '@modules/audio/audio.service';

@Injectable()
export class EpisodeService extends BaseService<EpisodeRepository> {
  constructor(
    protected readonly repository: EpisodeRepository,
    protected readonly awsService: AwsS3Service,
    protected readonly audioService: AudioService,
    protected readonly categoryService: CategoryService,
    protected readonly tagService: TagService,
  ) {
    super();
  }
  private isEmptyObj = function (obj) {
    return Object.keys(obj).length === 0;
  };

  async create(createEpisodeDto: CreateEpisodeDto): Promise<IEpisodeDocument> {
    try {
      if (this.isEmptyObj(createEpisodeDto))
        throw new HttpException(
          'Data is empty!!!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      const data = {
        ...createEpisodeDto,
        slug: slugify(createEpisodeDto.name, {
          replacement: '-',
          remove: /[*+~.()'"!:@]/g,
          lower: true,
        }),
      };
      return this.repository.create(data);
    } catch (error) {
      throw new HttpException(
        'Server is out of reach!!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateById(
    id: string | Types.ObjectId,
    data: UpdateEpisodeDto,
  ): Promise<IEpisodeDocument> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return this.repository.updateById(id, data);
  }

  async uploadAudio(
    id: string | Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<IEpisodeAudio> {
    const product = await this.findById(id);
    const content: Buffer = file.buffer;
    const name = product._id;
    const aws: IAwsS3Response = await this.awsService.s3PutItemInBucket(
      name,
      content,
      {
        path: `images/products`,
      },
    );

    const audioDoc = await this.audioService.create(aws);
    await this.repository.updateById(id, {
      audio: audioDoc._id,
    });
    // return res;
    // success: boolean;
    // alt: string;
    // message: string;
    // imageUrl: string;

    return {
      message: 'Image uploaded successfuly',
      success: true,
      audioUrl:
        'https://ecomm.ams3.digitaloceanspaces.com/' + aws.pathWithFilename,
    };
  }

  async deleteAudio(id: string | Types.ObjectId): Promise<IEpisodeDocument> {
    const episode = await this.findById(id);
    const audio = await this.audioService.findById(episode.audio);

    if (!episode.audio) {
      throw new HttpException(MessagesMapping['#22'], HttpStatus.NOT_FOUND);
    }

    await this.audioService.deleteById(episode.audio);

    await this.awsService.s3DeleteItemInBucket(audio.pathWithFilename);

    episode.audio = undefined;

    await episode.save();

    return episode;
  }
}
