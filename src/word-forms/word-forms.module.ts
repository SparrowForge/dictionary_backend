import { Module } from '@nestjs/common';
import { WordFormsController } from './word-forms.controller';
import { WordFormsService } from './word-forms.service';
import { WordForms } from './entities/word-forms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WordForms])],
  controllers: [WordFormsController],
  providers: [WordFormsService]
})
export class WordFormsModule { }
