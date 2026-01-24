import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { Status } from 'src/common/enums';

export class FilterCatagoryDto extends PaginationDto {
  @ApiProperty({ description: 'Catagory name', example: 'catagory1' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Catagory active status', example: Status.ACTIVE, default: Status.ACTIVE })
  @IsEnum(Status, { message: 'Status must be active or inactive' })
  @IsOptional()
  status: Status;

}
