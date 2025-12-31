import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Status } from '../../common/enums';

@Entity('dc_roles')
export class Role {
  @ApiProperty({
    description: 'Role ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Role name',
    example: 'Teacher',
  })
  @Column({ length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Teacher role with access to course management',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Role status', example: 'active', enum: Status, })
  @Column({ type: 'enum', enum: Status, nullable: false, default: Status.ACTIVE, })
  status: Status;

  @ApiProperty({ description: 'Role created at', example: '2024-03-14T12:00:00.000Z', })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Role updated at', example: '2024-03-14T12:00:00.000Z', })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Role deleted at', example: '2024-03-14T12:00:00.000Z', })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
