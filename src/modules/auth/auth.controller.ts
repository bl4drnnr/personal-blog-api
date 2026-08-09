import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { CurrentUserId } from '@common/decorators/current-user.decorator';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { AuthService } from './auth.service';
import { LoginDto, MfaCodeDto } from './dto/auth.dto';
import { TempTokenGuard, TempTokenRequest } from './temp-token.guard';
import { REFRESH_COOKIE } from './tokens.service';

const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Throttle(AUTH_THROTTLE)
  @ApiOperation({ summary: 'Verify credentials; returns a temp token for the MFA step' })
  @ApiOkResponse({
    description:
      'Either { mfaSetupRequired, tempToken } on first login or { mfaRequired, tempToken }.',
  })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Get('mfa/setup')
  @UseGuards(TempTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the TOTP enrollment secret and QR (temp token required)' })
  @ApiOkResponse({ description: '{ secret, otpauthUrl, qrDataUrl }.' })
  mfaSetup(@Req() req: TempTokenRequest) {
    return this.auth.startMfaEnrollment(req.userId, req.tokenPurpose);
  }

  @Post('mfa/enable')
  @HttpCode(200)
  @Throttle(AUTH_THROTTLE)
  @UseGuards(TempTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Enable MFA with a code; issues access token + refresh cookie' })
  @ApiOkResponse({ description: '{ accessToken }; sets the _rt refresh cookie.' })
  mfaEnable(
    @Req() req: TempTokenRequest,
    @Body() dto: MfaCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.enableMfa(req.userId, req.tokenPurpose, dto.code, res);
  }

  @Post('mfa/verify')
  @HttpCode(200)
  @Throttle(AUTH_THROTTLE)
  @UseGuards(TempTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Answer the MFA challenge; issues access token + refresh cookie' })
  @ApiOkResponse({ description: '{ accessToken }; sets the _rt refresh cookie.' })
  mfaVerify(
    @Req() req: TempTokenRequest,
    @Body() dto: MfaCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.verifyMfa(req.userId, req.tokenPurpose, dto.code, res);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiCookieAuth('_rt')
  @ApiOperation({ summary: 'Rotate tokens using the _rt refresh cookie' })
  @ApiOkResponse({ description: '{ accessToken }; rotates the _rt refresh cookie.' })
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.auth.refresh(req.cookies[REFRESH_COOKIE], res);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Revoke the current session and clear the refresh cookie' })
  async logout(@CurrentUserId() userId: string, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(userId, res);
  }
}
