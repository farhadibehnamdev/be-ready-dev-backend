import { PartialType } from '@nestjs/swagger';

import { Host } from '../models/host.entity';

export class HostDto extends PartialType(Host) {}
