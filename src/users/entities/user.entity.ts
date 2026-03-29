import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums';
import { RolesEnum } from '../../common/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Files } from 'src/files/entities/file.entity';
import { Classes } from 'src/classes/entities/classes.entity';

@Entity('dc_users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User role ID', example: 1, })
  @Column({ type: 'enum', enum: RolesEnum, nullable: false })
  role: RolesEnum;

  @ApiProperty({ description: 'User name', example: 'johndoe' })
  @Column({ unique: false, nullable: false })
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

  @ApiProperty()
  @Column({ type: 'boolean', default: false, })
  is_verified: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  verification_token?: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  verification_token_expires_at?: Date | null;

  //--
  @ApiProperty({ description: 'Image file id', example: 10, })
  @Column({ nullable: true })
  image_file_id?: number;

  @ApiProperty({ description: 'Class id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @Column({ nullable: true, type: 'uuid' })
  class_id?: string;

  @ApiProperty({ description: 'Student section', example: 'A', required: false, })
  @Column({ nullable: true })
  section?: string;

  @ApiProperty({ description: 'Student roll number', example: '00125', required: false, })
  @Column({ nullable: true })
  roll_number?: string;

  //====================================================================

  @ApiProperty({ description: 'Created by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @Column({ nullable: true })
  created_by: string;

  @ApiProperty({ description: 'User created at', example: '2025-03-14T12:00:00.000Z', })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Updated by user id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', })
  @Column({ nullable: true })
  updated_by: string;

  @ApiProperty({ description: 'User updated at', example: '2025-03-14T12:00:00.000Z', })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ApiProperty({ description: 'User deleted at', example: '2025-03-14T12:00:00.000Z', })
  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

  /* Relation */
  @ApiProperty({ description: 'File object', type: () => Files, })
  @ManyToOne(() => Files, { nullable: true })
  @JoinColumn({ name: 'image_file_id' })
  file: Files;

  @ApiProperty({ description: 'Class object', type: () => Classes, })
  @ManyToOne(() => Classes, { nullable: true })
  @JoinColumn({ name: 'class_id' })
  class: Classes


}
