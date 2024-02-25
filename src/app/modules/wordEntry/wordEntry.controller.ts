import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { WordEntryService } from './wordEntry.service';
import { UpdateWordEntryDto } from './dtos/update-wordEntry.dto';
import { FindTagsDto } from '@modules/tag/dtos/find-tags.dto';
import { CreateWordEntryDto } from './dtos/create-wordEntry.dto';

@Controller('words')
@Roles(RoleTypeEnum.All)
export class WordEntryController {
  constructor(private readonly service: WordEntryService) {}

  @Post()
  create(@Body() data: CreateWordEntryDto) {
    return this.service.create(data);
  }

  @Get()
  findAll(@Query(new PaginationPipe()) q: FindTagsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  updateById(@Param('id') id: string, @Body() data: UpdateWordEntryDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
