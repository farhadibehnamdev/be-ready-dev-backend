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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { FindEpisodesDto } from './dtos/find-episode.dto';

@Controller('episodes')
@ApiTags('Episodes')
@Roles(RoleTypeEnum.All)
export class EpisodeController {
  constructor(private readonly service: EpisodeService) {}

  @Post()
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOperation({ summary: 'Create an episode' })
  @ApiResponse({
    status: 201,
    description: 'The episode has been successfully created.',
  })
  @ApiBody({ type: CreateEpisodeDto })
  create(@Body() data: CreateEpisodeDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an episode by ID' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiBody({ type: UpdateEpisodeDto })
  updateById(@Param('id') id: string, @Body() data: UpdateEpisodeDto) {
    return this.service.updateById(id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Find episodes with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of episodes with pagination.',
  })
  @ApiQuery({ type: FindEpisodesDto })
  findAll(@Query(new PaginationPipe()) q: FindEpisodesDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an episode by ID' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOperation({ summary: 'Delete an episode by ID' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  deleteById(@Param('id') id: string) {
    this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.AUDIO)
  @Post(':id/audios')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOperation({ summary: 'Upload audio for an episode' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiBody({ type: 'file' })
  uploadAudio(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadAudio(id, file);
  }

  @Delete(':id/audios')
  @Roles(RoleTypeEnum.Vendor, RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
  @ApiOperation({ summary: 'Delete audio for an episode' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  deleteAudio(@Param('id') id: string) {
    return this.service.deleteAudio(id);
  }
}
