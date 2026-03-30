import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuditInterceptorProvider } from './common/providers/audit-interceptor.provider';
import { AuditModule } from './audits/audits.module';
import { AuthModule } from './auth/auth.module';
import { TeacherModule } from './teacher/teacher.module';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { FilesModule } from './files/files.module';
import { WordsModule } from './words/words.module';
import { WordClassesModule } from './word-classes/word-classes.module';
import { WordSynonymsModule } from './word-synonyms/word-synonyms.module';
import { WordAntonymsModule } from './word-antonyms/word-antonyms.module';
import { WordFormsModule } from './word-forms/word-forms.module';
import { WordSentencesModule } from './word-sentences/word-sentences.module';
import { WordMediaModule } from './word-media/word-media.module';
import { FavouriteWordsModule } from './favourite_words/favourite_words.module';
import { StudentActivityModule } from './student_activity/student-activity.module';
import { CatagoryModule } from './catagory/catagory.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationRecordModule } from './notification-record/notification-record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: AppService,
    }),
    AuditModule,
    AuthModule,
    CommandModule,
    UsersModule,
    CatagoryModule,
    TeacherModule,
    ClassesModule,
    StudentsModule,
    FilesModule,
    WordsModule,
    WordClassesModule,
    WordSynonymsModule,
    WordAntonymsModule,
    WordFormsModule,
    WordSentencesModule,
    WordMediaModule,
    FavouriteWordsModule,
    StudentActivityModule,
    NotificationsModule,
    NotificationRecordModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuditInterceptorProvider,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
