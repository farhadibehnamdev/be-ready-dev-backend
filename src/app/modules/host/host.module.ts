import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Host, HostSchema } from './models/host.entity';
import { HostRepository } from './repositories/host.repository';
import { HostService } from './host.service';
import { HostController } from './host.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Host.name, schema: HostSchema }]),
  ],
  providers: [HostService, HostRepository],
  controllers: [HostController],
  exports: [HostService, HostRepository],
})
export class HostModule {}
