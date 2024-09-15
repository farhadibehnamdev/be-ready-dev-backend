import { ImageModule } from '@modules/image/image.module';
import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from '@shared/aws/aws.module';
import { PersonRepository } from './repositories/person.repository';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Person, PersonSchema } from './models/person.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
    forwardRef(() => ImageModule),
    forwardRef(() => AwsModule),
    forwardRef(() => UserModule),
  ],
  providers: [PersonService, PersonRepository],
  controllers: [PersonController],
  exports: [PersonService, PersonRepository],
})
export class PersonModule {}
