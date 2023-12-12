import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostController } from './goal.controller';
import { Goal, GoalSchema } from './models/goal.entity';
import { GoalService } from './goal.service';
import { GoalRepository } from './repositories/goal.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],
  providers: [GoalService, GoalRepository],
  controllers: [HostController],
  exports: [GoalService, GoalRepository],
})
export class GoalModule {}
