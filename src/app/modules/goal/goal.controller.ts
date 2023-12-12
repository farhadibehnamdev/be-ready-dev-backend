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
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dtos/create-goal.dto';
import { FindGoalsDto } from './dtos/find-goals.dto';
import { UpdateGoalDto } from './dtos/update-goal.dto';

@Controller('goals')
@Roles(RoleTypeEnum.User)
export class HostController {
  constructor(private readonly service: GoalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a host' })
  @ApiResponse({
    status: 201,
    description: 'The host has been successfully created.',
  })
  @ApiBody({ type: CreateGoalDto })
  create(@Body() data: CreateGoalDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Find hosts with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of hosts with pagination.',
  })
  @ApiQuery({ type: FindGoalsDto })
  findAll(@Query(new PaginationPipe()) q: FindGoalsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a host by ID' })
  @ApiParam({ name: 'id', description: 'Host ID' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a host by ID' })
  @ApiParam({ name: 'id', description: 'Host ID' })
  @ApiBody({ type: UpdateGoalDto })
  updateById(@Param('id') id: string, @Body() data: UpdateGoalDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a host by ID' })
  @ApiParam({ name: 'id', description: 'Host ID' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
