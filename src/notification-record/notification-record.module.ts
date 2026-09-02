import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { NotificationRecord } from './entities/notification-record.entity';
import { NotificationRecordController } from './notification-record.controller';
import { NotificationRecordService } from './notification-record.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationRecord]),
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [NotificationRecordController],
  providers: [NotificationRecordService],
  exports: [NotificationRecordService],
})
export class NotificationRecordModule { }
