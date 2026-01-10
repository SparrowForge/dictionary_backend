import { Module } from '@nestjs/common';
import { StudentActivityService } from './student-activity.service';
import { StudentActivity } from './entities/student-activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentActivityController } from './student-activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentActivity])],
  controllers: [StudentActivityController],
  providers: [StudentActivityService]
})
export class StudentActivityModule { }
