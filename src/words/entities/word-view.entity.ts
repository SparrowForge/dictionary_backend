import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Words } from './words.entity';

@Entity('dc_word_views')
@Index('IDX_dc_word_views_user_word_unique', ['user_id', 'word_id'], { unique: true })
export class WordView {
  @ApiProperty({ description: 'Word view ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ApiProperty({ description: 'Word id', example: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  @Column({ type: 'uuid', nullable: false })
  word_id: string;

  @ApiProperty({ description: 'Word viewed at', example: '2025-03-14T12:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'User object', type: () => User })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Words object', type: () => Words })
  @ManyToOne(() => Words, { nullable: false })
  @JoinColumn({ name: 'word_id' })
  word: Words;
}
