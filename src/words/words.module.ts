import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from './entities/words.entity';
import { Classes } from 'src/classes/entities/classes.entity';
import { WordDetails } from './entities/word-details.entity';
import { WordView } from './entities/word-view.entity';
import { WordSentences } from 'src/word-sentences/entities/word-sentences.entity';
import { WordSynonyms } from 'src/word-synonyms/entities/word-synonyms.entity';
import { WordAntonyms } from 'src/word-antonyms/entities/word-antonyms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Words,
      Classes,
      WordDetails,
      WordView,
      WordSentences,
      WordSynonyms,
      WordAntonyms,
    ]),
  ],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
