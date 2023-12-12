import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { GoalDto } from './goal.dto';

export class PaginatedGoalDto extends PaginatedResponseDto<GoalDto> {
  docs: GoalDto[];
}
