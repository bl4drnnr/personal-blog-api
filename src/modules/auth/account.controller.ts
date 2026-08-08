import { Body, Controller, HttpCode, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUserId } from '@common/decorators/current-user.decorator';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/auth.dto';

@ApiTags('Account')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(AccessTokenGuard)
export class AccountController {
  constructor(private readonly auth: AuthService) {}

  @Put('password')
  @HttpCode(204)
  @ApiOperation({ summary: '[admin] Change the account password' })
  @ApiNoContentResponse({ description: 'Password changed.' })
  @ApiUnauthorizedResponse({ description: 'Missing token or wrong current password.' })
  async changePassword(@CurrentUserId() userId: string, @Body() dto: ChangePasswordDto) {
    await this.auth.changePassword(userId, dto.currentPassword, dto.newPassword);
  }
}
