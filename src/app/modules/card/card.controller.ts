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

import { CardService } from './card.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { FindCardsDto } from './dtos/find-cards.dto';
import { CardReviewDto } from './dtos/card-review-dto';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { JwtPayload } from '@shared/interfaces/jwt-payload.interface';

@Roles(RoleTypeEnum.User)
@ApiTags('Card')
@Controller('cards')
export class CardController {
  constructor(private readonly service: CardService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Card' })
  @ApiCreatedResponse({
    description: 'The Card has been successfully created.',
  })
  @ApiBody({ type: CreateCardDto })
  create(@Body() data: CreateCardDto) {
    return this.service.create(data);
  }
  @Patch('review')
  reviewCard(@Body() reviewData: CardReviewDto) {
    return this.service.reviewCard(reviewData.cardId, reviewData.grade);
  }

  @Get('next-card')
  @Roles(RoleTypeEnum.User)
  @ApiOperation({ summary: 'Next Card' })
  @ApiOkResponse({ description: 'Successfully found Card' })
  nextCard() {
    return this.service.getNextCard(userId);
  }

  @Get(':id')
  @Roles(RoleTypeEnum.User)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find Card by ID' })
  @ApiOkResponse({ description: 'Successfully found the Card' })
  @ApiNotFoundResponse({ description: 'Card not found' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Card by ID' })
  @ApiOkResponse({ description: 'Successfully updated the Card' })
  @ApiNotFoundResponse({ description: 'Card not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCardDto })
  updateById(@Param('id') id: string, @Body() data: UpdateCardDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Card by ID' })
  @ApiOkResponse({ description: 'Successfully deleted the Card' })
  @ApiNotFoundResponse({ description: 'Card not found' })
  @ApiParam({ name: 'id', type: String })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
