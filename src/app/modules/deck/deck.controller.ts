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

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { DeckService } from './deck.service';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';
import { FindDecksDto } from './dtos/find-decks.dto';
import { AuthUser } from '@shared/decorators/auth-user.decorator';

@Roles(RoleTypeEnum.All)
@ApiTags('Deck')
@Controller('decks')
export class DeckController {
  constructor(private readonly service: DeckService) {}

  @Post()
  @Roles(RoleTypeEnum.All)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Deck' })
  @ApiCreatedResponse({
    description: 'The Deck has been successfully created.',
  })
  @ApiBody({ type: CreateDeckDto })
  create(@Body() data: CreateDeckDto, @AuthUser() user: any) {
    return this.service.create(data, user);
  }

  @Get()
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find all Deck' })
  @ApiOkResponse({ description: 'Successfully found Deck' })
  findAll(@Query(new PaginationPipe()) q: FindDecksDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find Deck by ID' })
  @ApiOkResponse({ description: 'Successfully found the Deck' })
  @ApiNotFoundResponse({ description: 'Deck not found' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Deck by ID' })
  @ApiOkResponse({ description: 'Successfully updated the Deck' })
  @ApiNotFoundResponse({ description: 'Deck not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDeckDto })
  updateById(@Param('id') id: string, @Body() data: UpdateDeckDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Deck by ID' })
  @ApiOkResponse({ description: 'Successfully deleted the Deck' })
  @ApiNotFoundResponse({ description: 'Deck not found' })
  @ApiParam({ name: 'id', type: String })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
