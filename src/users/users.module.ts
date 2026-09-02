import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/jwt.strategy';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { WordView } from '../words/entities/word-view.entity';
import { AuditLog } from '../audits/entities/audit.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { Catagory } from '../catagory/entities/catagory.entity';
import { Classes } from '../classes/entities/classes.entity';
import { FavouriteWords } from '../favourite_words/entities/favourite_words.entity';
import { NotificationRecord } from '../notification-record/entities/notification-record.entity';
import { UserToFirebaseTokenMap } from '../notifications/entity/userToFirebaseTokenMap.entity';
import { StudentActivity } from '../student_activity/entities/student-activity.entity';
import { Students } from '../students/entities/students.entity';
import { Files } from '../files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AuditLog,
      PasswordResetToken,
      RefreshToken,
      Catagory,
      Classes,
      FavouriteWords,
      NotificationRecord,
      UserToFirebaseTokenMap,
      StudentActivity,
      WordView,
      Students,
      Files]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule { }
