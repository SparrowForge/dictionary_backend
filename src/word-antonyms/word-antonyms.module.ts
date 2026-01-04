import { Module } from '@nestjs/common';
import { WordAntonymsController } from './word-antonyms.controller';
import { WordAntonymsService } from './word-antonyms.service';
import { WordAntonyms } from './entities/word-antonyms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WordAntonyms])],
  controllers: [WordAntonymsController],
  providers: [WordAntonymsService]
})
export class WordAntonymsModule { }
