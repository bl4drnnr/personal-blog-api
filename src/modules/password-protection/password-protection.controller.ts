import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { PasswordProtectionService } from './password-protection.service';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import { UpdatePasswordProtectionModeDto } from '@dto/password-protection/requests/update-password-protection-mode.dto';
import { VerifyPasswordDto } from '@dto/password-protection/requests/verify-password.dto';
import { PasswordProtectionStatusDto } from '@dto/password-protection/responses/password-protection-status.dto';
import { VerifyPasswordResponseDto } from '@dto/password-protection/responses/verify-password-response.dto';
import { UserId } from '@decorators/user-id.decorator';

@Controller('password-protection')
export class PasswordProtectionController {
  constructor(
    private readonly passwordProtectionService: PasswordProtectionService
  ) {}

  // Public endpoint to check password protection status
  @Get('password-protection-status')
  async getPasswordProtectionStatus(): Promise<PasswordProtectionStatusDto> {
    const status =
      await this.passwordProtectionService.getPasswordProtectionStatus();
    return new PasswordProtectionStatusDto(status);
  }

  // TODO: FIX THIS ENDPOINT, NO NEED FOR THE GUARD, DO IT DIFFERENTLY
  // Public endpoint to verify password and get access token
  @Post('password-protection-verify')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async verifyPassword(
    @Body() data: VerifyPasswordDto,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ): Promise<VerifyPasswordResponseDto> {
    const result = await this.passwordProtectionService.verifyPassword({
      password: data.password,
      userId,
      trx
    });
    return new VerifyPasswordResponseDto(result);
  }

  // Admin endpoint to get password protection settings
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @Get('admin/password-protection')
  async getPasswordProtectionModeAdmin() {
    return await this.passwordProtectionService.getPasswordProtectionModeAdmin();
  }

  // Admin endpoint to update password protection settings
  @UseGuards(BasicAuthGuard)
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Put('admin/password-protection')
  async updatePasswordProtectionMode(
    @Body() data: UpdatePasswordProtectionModeDto,
    @TrxDecorator() trx: Transaction
  ) {
    return await this.passwordProtectionService.updatePasswordProtectionMode({
      data,
      trx
    });
  }
}
