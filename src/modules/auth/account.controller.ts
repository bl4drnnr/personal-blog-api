import { Body, Controller, HttpCode, Put, UseGuards } from '@nestjs/common';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/auth.dto';

@Controller('admin')
@UseGuards(AccessTokenGuard)
export class AccountController {
  constructor(private readonly auth: AuthService) {}

  @Put('password')
  @HttpCode(204)
  async changePassword(@CurrentUserId() userId: string, @Body() dto: ChangePasswordDto) {
    await this.auth.changePassword(userId, dto.currentPassword, dto.newPassword);
  }
}
