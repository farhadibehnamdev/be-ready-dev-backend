import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UploadFileMultiple,
  UploadFileSingle,
} from '@shared/decorators/file.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { FindPodcastsDto } from './dtos/find-podcasts.dto';

@ApiTags('Podcasts')
@Controller('podcasts')
@Roles(RoleTypeEnum.All)
export class PodcastController {
  constructor(private readonly service: PodcastService) {}

  @Post()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Successfully created podcast.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiOperation({ summary: 'Create podcast' })
  @ApiBody({ type: CreatePodcastDto, description: 'Podcast Information' })
  create(@Body() data: CreatePodcastDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully updated podcast.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Podcast not found.' })
  @ApiOperation({ summary: 'Update podcast by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Podcast ID' })
  @ApiBody({ type: UpdatePodcastDto, description: 'Podcast Information' })
  updateById(@Param('id') id: string, @Body() data: UpdatePodcastDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Successfully fetched podcasts.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiOperation({ summary: 'Get all podcasts' })
  @ApiQuery({ type: FindPodcastsDto, description: 'Pagination options' })
  findAll(@Query(new PaginationPipe()) q: FindPodcastsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOkResponse({ description: 'Successfully fetched podcast.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Podcast not found.' })
  @ApiOperation({ summary: 'Get podcast by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Podcast ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('main/image/:id')
  findMainProductImage(@Param('id') id: string) {
    return this.service.getMainProductImage(id);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully deleted podcast.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Podcast not found.' })
  @ApiOperation({ summary: 'Delete podcast by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Podcast ID' })
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOperation({ summary: 'Upload main image' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the image' })
  @ApiBody({ description: 'The image file', type: 'multipart/form-data' })
  uploadMainImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadMainImage(id, file);
  }

  @Delete(':id/images')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOperation({ summary: 'Delete main image' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the image' })
  deleteMainImage(@Param('id') id: string) {
    return this.service.deleteMainImage(id);
  }
}
