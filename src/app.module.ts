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
    UsersModule,],
  controllers: [AppController],
  providers: [AppService, AuditInterceptorProvider],
})
export class AppModule { }
