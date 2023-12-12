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
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';

import { HostService } from './host.service';
import { CreateHostDto } from './dtos/create-host.dto';
import { FindHostsDto } from './dtos/find-hosts.dto';
import { UpdateHostDto } from './dtos/update-host.dto';

// @Controller('hosts')
// @Roles(RoleTypeEnum.All)
// export class HostController {
//   constructor(private readonly service: HostService) {}

//   @Post()
//   create(@Body() data: CreateHostDto) {
//     return this.service.create(data);
//   }

//   @Get()
//   findAll(@Query(new PaginationPipe()) q: FindHostsDto) {
//     return this.service.findPaginated((<any>q).filter, {
//       ...(<any>q).options,
//     });
//   }

//   @Get(':id')
//   findById(@Param('id') id: string) {
//     return this.service.findById(id);
//   }

//   @Put(':id')
//   updateById(@Param('id') id: string, @Body() data: UpdateHostDto) {
//     return this.service.updateById(id, data);
//   }

//   @Delete(':id')
//   deleteById(@Param('id') id: string) {
//     return this.service.deleteById(id);
//   }
// }

@Controller('hosts')
@ApiTags('Hosts')
@Roles(RoleTypeEnum.All)
export class HostController {
  constructor(private readonly service: HostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a host' })
  @ApiResponse({
    status: 201,
    description: 'The host has been successfully created.',
  })
  @ApiBody({ type: CreateHostDto })
  create(@Body() data: CreateHostDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Find hosts with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of hosts with pagination.',
  })
  @ApiQuery({ type: FindHostsDto })
  findAll(@Query(new PaginationPipe()) q: FindHostsDto) {
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
  @ApiBody({ type: UpdateHostDto })
  updateById(@Param('id') id: string, @Body() data: UpdateHostDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a host by ID' })
  @ApiParam({ name: 'id', description: 'Host ID' })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }
}
