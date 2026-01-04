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
import { Words } from 'src/words/entities/words.entity';

@Entity('dc_word_forms')
export class WordForms {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Word id', example: 'class1' })
  @Column({ unique: false, nullable: false })
  word_id: string;

  @ApiProperty({ description: 'Word form_type', example: 'form_type', })
  @Column({ nullable: false })
  form_type: string;

  @ApiProperty({ description: 'Word form_value', example: 'form_value', })
  @Column({ nullable: false })
  form_value: string;

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

  //Relations==============================================================================
  @ApiProperty({ description: 'Words object', type: () => Words, })
  @ManyToOne(() => Words, { nullable: true })
  @JoinColumn({ name: 'word_id' })
  word: Words;

  @ApiProperty({ description: 'User object', type: () => User, })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by_user: User;

  @ApiProperty({ description: 'User object', type: () => User, })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by_user: User;

}
