import { Module } from '@nestjs/common';
import { WordMediaController } from './word-media.controller';
import { WordMediaService } from './word-media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordMedia } from './entities/word-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordMedia])],
  controllers: [WordMediaController],
  providers: [WordMediaService]
})
export class WordMediaModule { }
