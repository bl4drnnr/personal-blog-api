import { Body, Controller, HttpCode, Put, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
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
  @HttpCode(200)
  @ApiOperation({ summary: '[admin] Change the account password (revokes other sessions)' })
  @ApiOkResponse({
    description:
      '{ accessToken }; the previous session is revoked and the _rt refresh cookie is rotated.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing token or wrong current password.' })
  changePassword(
    @CurrentUserId() userId: string,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.changePassword(userId, dto.currentPassword, dto.newPassword, res);
  }
}
