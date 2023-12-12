import { PartialType } from '@nestjs/swagger';
import { Goal } from '../models/goal.entity';

export class GoalDto extends PartialType(Goal) {}
