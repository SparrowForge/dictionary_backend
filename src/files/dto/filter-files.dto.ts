import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { PaginationDto } from '../../common/dto/pagination.dto';
import { FileType } from '../entities/file.entity';

export class FilterFilesDto extends PaginationDto {
  @ApiProperty({ description: 'Filter by assigned rider ID', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  assignedRiderId?: number;

  @ApiProperty({ description: 'Filter by name (exact)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  file_name?: string;

  @ApiProperty({
    description: 'Search by file name or original name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Type of file',
    enum: FileType,
    example: FileType.PHOTO,
    required: false,
  })
  @IsOptional()
  @IsString()
  file_type?: string;
}
