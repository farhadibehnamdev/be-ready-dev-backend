import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { ListeningSessionService } from './listeningSession.service';
import { CreateListeningSessionDto } from './dtos/create-listeningSession.dto';
import { UpdateListeningSessionDto } from './dtos/update-listeningSession.dto';
import { FindListeningSessionsDto } from './dtos/find-listeningSession.dto';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

@Controller('listeningSession')
@Roles(RoleTypeEnum.All)
export class ListeningSessionController {
  constructor(private readonly service: ListeningSessionService) {}

  @Post()
  @Roles(RoleTypeEnum.All)
  create(@Body() data: CreateListeningSessionDto) {
    return this.service.create(data);
  }

  @Put('/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() data: UpdateListeningSessionDto,
  ) {
    return await this.service.updateSession(id, data);
  }

  @Get(':id')
  async getSessionPaginated(
    @Query(new PaginationPipe()) q: FindListeningSessionsDto,
  ) {
    return await this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  async getSessionById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Roles(RoleTypeEnum.User)
  @Patch(':id/stop')
  async stopSession(@Param('id') id: string) {
    return await this.service.stopSession(id);
  }
}
