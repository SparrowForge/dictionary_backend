import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from 'src/auth/email.service';

@Module({
  providers: [EmailService],
  controllers: [EmailController]
})
export class EmailModule { }
