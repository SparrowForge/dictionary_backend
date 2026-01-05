import { Module } from '@nestjs/common';
import { WordSentencesController } from './word-sentences.controller';
import { WordSentencesService } from './word-sentences.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordSentences } from './entities/word-sentences.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordSentences])],
  controllers: [WordSentencesController],
  providers: [WordSentencesService]
})
export class WordSentencesModule { }
