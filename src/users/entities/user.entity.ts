import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums';
import { Roles } from '../../common/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dc_users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User role ID', example: 1, })
  @Column({ type: 'enum', enum: Roles, nullable: false })
  role: Roles;

  @ApiProperty({ description: 'User name', example: 'johndoe' })
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'User phone number', example: '+880', required: false, })
  @Column({ nullable: true })
  phone_no?: string;

  @ApiProperty({ description: 'User password', example: 'p@ssword' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'User status', example: 'active', enum: Status, })
  @Column({ type: 'enum', enum: Status, nullable: false, default: Status.ACTIVE, })
  status: Status;

  //====================================================================

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @Column({ nullable: true })
  createdBy: string;

  @ApiProperty({ description: 'User created at', example: '2025-03-14T12:00:00.000Z', })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @Column({ nullable: true })
  updatedBy: string;

  @ApiProperty({ description: 'User updated at', example: '2025-03-14T12:00:00.000Z', })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'User deleted at', example: '2025-03-14T12:00:00.000Z', })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

}
