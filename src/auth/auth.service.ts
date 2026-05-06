/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { BaseResponseDto } from '../common/dto/base-response.dto';
import { Status, StatusEnum } from '../common/enums/status.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PasswordResetService } from './password-reset.service';
import { RefreshTokenService } from './refresh-token.service';
import { EmailService } from './email.service';
import { RolesEnum } from 'src/common/enums/role.enum';
// Import UserStatus enum (adjust the path as needed)

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private passwordResetService: PasswordResetService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    // UsersService.create already hashes the password.
    // Pass the DTO directly to avoid double-hashing.
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const existingUserByUserName = await this.usersService.findByEmail(createUserDto.name);
    if (existingUserByUserName) {
      throw new BadRequestException('Username already exists');
    }
    if (createUserDto.role === RolesEnum.STUDENT || createUserDto.role === RolesEnum.TEACHER) {
      createUserDto.status = Status.INACTIVE;
    }
    const verificationToken = await bcrypt.hash(
      `${createUserDto.email}-${Date.now()}`,
      10,
    );
    const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const enity = {
      ...createUserDto,
      verification_token: verificationToken,
      verification_token_expires_at: verificationTokenExpiresAt,
    };
    const user = await this.usersService.create(enity);
    const { password, ...result } = user;

    this.sendEmailByExternalApi('/api/v1/email/send-welcome-email', {
      email: user.email,
      name: user.name,
      verificationToken,
    });

    return new BaseResponseDto(result, 'User registered successfully');
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Import UserStatus enum from the appropriate location
    if (user.verification_token && !user.is_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    if (user.status !== StatusEnum.ACTIVE) {
      throw new UnauthorizedException('User account is inactive');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      email: user.email,
      sub: user.id,
      role: user.role
    });
    const refreshToken =
      await this.refreshTokenService.generateRefreshToken(user);

    const { password: _, ...userWithoutPassword } = user;

    return new BaseResponseDto(
      {
        user: {
          ...userWithoutPassword,
        },
        access_token: accessToken,
        refresh_token: refreshToken.token,
      },
      'Login successful',
    );
  }

  async refreshToken(token: string) {
    const refreshToken =
      await this.refreshTokenService.validateRefreshToken(token);
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = refreshToken.user;
    const accessToken = this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });
    const newRefreshToken =
      await this.refreshTokenService.generateRefreshToken(user);

    // Revoke the old refresh token
    await this.refreshTokenService.revokeRefreshToken(token);

    const { password, ...userWithoutPassword } = user;
    return new BaseResponseDto(
      {
        user: userWithoutPassword,
        access_token: accessToken,
        refresh_token: newRefreshToken.token,
      },
      'Token refreshed successfully',
    );
  }

  async logout(token: string) {
    await this.refreshTokenService.revokeRefreshToken(token);
    return new BaseResponseDto(null, 'Logged out successfully');
  }

  /**
   * Step 1: Request password reset - send verification code to email
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    await this.passwordResetService.requestPasswordReset(forgotPasswordDto);
    return new BaseResponseDto(
      null,
      'If the email exists, a verification code has been sent',
    );
  }

  /**
   * Step 2: Verify the code sent to email
   */
  async verifyResetCode(verifyCodeDto: VerifyCodeDto) {
    await this.passwordResetService.verifyCode(verifyCodeDto);
    return new BaseResponseDto(
      null,
      'Verification code is valid. You can now reset your password',
    );
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, token } = verifyEmailDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_verified) {
      return new BaseResponseDto(null, 'Email already verified');
    }

    if (!user.verification_token || user.verification_token !== token) {
      throw new BadRequestException('Invalid verification token');
    }

    if (
      !user.verification_token_expires_at ||
      new Date(user.verification_token_expires_at) < new Date()
    ) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.usersService.update(user.id, {
      is_verified: true,
      verification_token: null,
      verification_token_expires_at: null,
    });

    return new BaseResponseDto(null, 'Email verified successfully');
  }

  async resendVerificationEmail(resendVerificationEmailDto: ResendVerificationEmailDto) {
    const { email } = resendVerificationEmailDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_verified) {
      return new BaseResponseDto(null, 'Email already verified');
    }

    const now = new Date();
    if (
      user.verification_token &&
      user.verification_token_expires_at &&
      new Date(user.verification_token_expires_at) >= now
    ) {
      throw new BadRequestException(
        'Current verification token is still valid',
      );
    }

    const verificationToken = await bcrypt.hash(`${user.email}-${Date.now()}`, 10);
    const verificationTokenExpiresAt = new Date(now.getTime() + 15 * 60 * 1000);

    await this.usersService.update(user.id, {
      verification_token: verificationToken,
      verification_token_expires_at: verificationTokenExpiresAt,
    });

    this.sendEmailByExternalApi('/api/v1/email/re-send-verificatio-email', {
      email: user.email,
      name: user.name,
      verificationToken,
    });


    return new BaseResponseDto(
      null,
      'Verification email resent successfully',
    );
  }

  /**
   * Step 3: Reset password with verified code
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword, confirmPassword } = resetPasswordDto;

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    await this.passwordResetService.resetPassword(email, code, newPassword);
    return new BaseResponseDto(null, 'Password has been reset successfully');
  }

  private sendEmailByExternalApi(
    endpoint: string,
    body: Record<string, unknown>,
  ): void {
    const emailSendUrl = this.buildEmailSendUrl(endpoint);
    const emailSendHeaderKey = this.configService.get<string>('EMAIL_SEND_HEADER_KEY');

    if (!emailSendHeaderKey) {
      throw new InternalServerErrorException('Email sending configuration is missing');
    }
    console.log('email sending by api..')
    const response = fetch(emailSendUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-email-key': emailSendHeaderKey,
      },
      body: JSON.stringify(body),
    });
  }

  private buildEmailSendUrl(endpoint: string): string {
    const emailSendBaseUrl = this.configService.get<string>('EMAIL_SEND_URL');

    if (!emailSendBaseUrl) {
      throw new InternalServerErrorException('Email sending configuration is missing');
    }

    return `${emailSendBaseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }

}
