import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { EmailService } from 'src/auth/email.service';
import { SendWelcomeEmailDto } from './dto/send-welcome-email.dto';
import { SendVarificationEmailDto } from './dto/send-verification-email.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Email')
@Controller('api/v1/email')
@Public()
export class EmailController {
  constructor(private emailService: EmailService) { }

  @Post('send-welcome-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendWelcomeEmail(@Body() dto: SendWelcomeEmailDto): Promise<BaseResponseDto<any>> {
    await this.emailService.sendWelcomeEmail(
      dto.email,
      dto.name,
      dto.verificationToken,
    );
    return new BaseResponseDto(null, 'Email sent successfully');
  }

  @Post('send-varificatio-code-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendVerificationCode(@Body() dto: SendVarificationEmailDto): Promise<BaseResponseDto<any>> {
    await this.emailService.sendVerificationCode(dto.email, dto.code);
    return new BaseResponseDto(null, 'Vrification code email sent successfully');
  }

  @Post('re-send-varificatio-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resendVerificationEmail(@Body() dto: SendWelcomeEmailDto): Promise<BaseResponseDto<any>> {
    await this.emailService.sendWelcomeEmail(
      dto.email,
      dto.name,
      dto.verificationToken,
    );
    return new BaseResponseDto(null, 'Vrification email re-send successfully');
  }

}
