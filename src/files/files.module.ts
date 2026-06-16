import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryService } from './cloudinary.service';
import { Files } from './entities/file.entity';
import { FileReference } from './entities/file-reference.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Files, FileReference]),
    // ScheduleModule.forRoot(), // Uncomment when @nestjs/schedule is installed
  ],
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService],
  exports: [FilesService, CloudinaryService],
})
export class FilesModule { }
