import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Words } from './entities/words.entity';
import { Classes } from '../classes/entities/classes.entity';
import { WordDetails } from './entities/word-details.entity';
import { WordView } from './entities/word-view.entity';
import { WordSentences } from '../word-sentences/entities/word-sentences.entity';
import { WordSynonyms } from '../word-synonyms/entities/word-synonyms.entity';
import { WordAntonyms } from '../word-antonyms/entities/word-antonyms.entity';
import { WordForms } from '../word-forms/entities/word-forms.entity';

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
      WordForms,
    ]),
  ],
  controllers: [WordsController],
  providers: [WordsService],
})
export class WordsModule {}
