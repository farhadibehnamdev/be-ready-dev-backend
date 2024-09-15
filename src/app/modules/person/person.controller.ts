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
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConsumes,
} from '@nestjs/swagger';

import { UploadFileSingle } from '@shared/decorators/file.decorator';
import { AllowAnonymous } from '@shared/decorators/public.decorator';
import { Roles } from '@shared/decorators/roles.decorator';
import { ENUM_FILE_TYPE } from '@shared/enums/file.enum';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { PaginationPipe } from '@shared/pipes/pagination.pipe';
import { CreatePersonDto } from './dtos/create-person.dto';
import { FindPersonsDto } from './dtos/find-persons.dto';
import { UpdatePersonDto } from './dtos/update-person.dto';

@Roles(RoleTypeEnum.SuperAdmin, RoleTypeEnum.Admin)
@ApiTags('Persons')
@Controller('Persons')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Person' })
  @ApiCreatedResponse({
    description: 'The Person has been successfully created.',
  })
  @ApiBody({ type: CreatePersonDto })
  create(@Body() data: CreatePersonDto) {
    return this.service.create(data);
  }

  @Get()
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find all Persons' })
  @ApiOkResponse({ description: 'Successfully found Persons' })
  findAll(@Query(new PaginationPipe()) q: FindPersonsDto) {
    return this.service.findPaginated((<any>q).filter, {
      ...(<any>q).options,
    });
  }

  @Get(':id')
  @Roles(RoleTypeEnum.All)
  @AllowAnonymous()
  @ApiOperation({ summary: 'Find Person by ID' })
  @ApiOkResponse({ description: 'Successfully found the Person' })
  @ApiNotFoundResponse({ description: 'Person not found' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Person by ID' })
  @ApiOkResponse({ description: 'Successfully updated the Person' })
  @ApiNotFoundResponse({ description: 'Person not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePersonDto })
  updateById(@Param('id') id: string, @Body() data: UpdatePersonDto) {
    return this.service.updateById(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Person by ID' })
  @ApiOkResponse({ description: 'Successfully deleted the Person' })
  @ApiNotFoundResponse({ description: 'Person not found' })
  @ApiParam({ name: 'id', type: String })
  deleteById(@Param('id') id: string) {
    return this.service.deleteById(id);
  }

  @UploadFileSingle('file', ENUM_FILE_TYPE.IMAGE)
  @Post(':id/images/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image for Person' })
  @ApiCreatedResponse({ description: 'Successfully uploaded the image' })
  @ApiBadRequestResponse({ description: 'Invalid file upload request' })
  @ApiParam({ name: 'id', type: String })
  upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(id, file);
  }
}
