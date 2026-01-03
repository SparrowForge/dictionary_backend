import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Status } from 'src/common/enums';

export class FilterClassesDto extends PaginationDto {
  @ApiProperty({ description: 'Class name', example: 'class1' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Class active status', example: Status.ACTIVE, default: Status.ACTIVE })
  @IsEnum(Status, { message: 'Status must be active or inactive' })
  @IsOptional()
  status: Status;

}
