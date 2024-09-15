import { PartialType } from '@nestjs/swagger';
import { Person } from '../models/person.entity';

export class PersonDto extends PartialType(Person) {}
