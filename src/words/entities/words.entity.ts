import { ApiProperty } from '@nestjs/swagger';
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
import { User } from 'src/users/entities/user.entity';
import { WordStatusEnum } from 'src/common/enums/word-status.enum';

@Entity('dc_words')
export class Words {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'English word', example: 'Good' })
  @Column({ unique: true, nullable: false })
  english_word: string;

  @ApiProperty({ description: 'Bangla word', example: '...' })
  @Column({ unique: false, nullable: false })
  bangla_word: string;

  @ApiProperty({ description: 'English word', example: 'Good' })
  @Column({ unique: false, nullable: true })
  part_of_speech: string;

  @ApiProperty({ description: 'English word', example: 'Good' })
  @Column({ unique: false, nullable: true })
  description: string;

  @ApiProperty({ description: 'Word Status', example: WordStatusEnum.PENDING })
  @Column({ type: 'enum', enum: WordStatusEnum, default: WordStatusEnum.PENDING, unique: false, nullable: false })
  status: WordStatusEnum;

  @ApiProperty({ description: 'approved_by User id', example: 'xxxx xxxx xxxxx xxx' })
  @Column({ unique: false, nullable: true })
  approved_by_user_id: string;

  @ApiProperty({ description: 'Word approved at', example: '2025-03-14T12:00:00.000Z', })
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  approved_at: Date;

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


  //Relations====================
  @ApiProperty({ description: 'User object', type: () => User, })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by_user: User;

  @ApiProperty({ description: 'User object', type: () => User, })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by_user: User;

  @ApiProperty({ description: 'User object', type: () => User, })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by_user: User;

}
