import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from './entities/words.entity';
import { Classes } from 'src/classes/entities/classes.entity';
import { WordDetails } from './entities/word-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Words, Classes, WordDetails])],
  controllers: [WordsController],
  providers: [WordsService]
})
export class WordsModule { }
