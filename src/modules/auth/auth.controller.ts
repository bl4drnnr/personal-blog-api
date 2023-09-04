import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { JwtGuard } from '@guards/jwt.guard';
import { Cookie } from '@decorators/cookie.decorator';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh')
  @UseGuards(JwtGuard)
  async refreshToken(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookie('_rt') refreshToken: string
  ) {
    const { _rt, _at } = await this.authService.refreshToken(refreshToken);

    res.cookie('_rt', _rt);

    return _at;
  }
}
