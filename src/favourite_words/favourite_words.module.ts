import { Module } from '@nestjs/common';
import { FavouriteWordsService } from './favourite_words.service';
import { FavouriteWords } from './entities/favourite_words.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouriteWordsController } from './favourite_words.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FavouriteWords])],
  controllers: [FavouriteWordsController],
  providers: [FavouriteWordsService]
})
export class FavouriteWordsModule { }
