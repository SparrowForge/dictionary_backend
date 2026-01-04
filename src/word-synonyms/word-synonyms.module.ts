import { Module } from '@nestjs/common';
import { WordSynonymsController } from './word-synonyms.controller';
import { WordSynonymsService } from './word-synonyms.service';
import { WordSynonyms } from './entities/word-synonyms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WordSynonyms])],
  controllers: [WordSynonymsController],
  providers: [WordSynonymsService]
})
export class WordSynonymsModule { }
