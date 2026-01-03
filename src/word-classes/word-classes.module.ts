import { Module } from '@nestjs/common';
import { WordClassesController } from './word-classes.controller';
import { WordClassesService } from './word-classes.service';
import { WordClasses } from './entities/word-classes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WordClasses])],
  controllers: [WordClassesController],
  providers: [WordClassesService]
})
export class WordClassesModule { }
