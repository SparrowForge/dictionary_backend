import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from './entities/words.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Words])],
  controllers: [WordsController],
  providers: [WordsService]
})
export class WordsModule { }
