import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { UserId } from '@decorators/user.decorator';
import { JwtGuard } from '@guards/jwt.guard';
import { SignInDto } from '@dto/sign-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-in')
  signIn(@Body() payload: SignInDto) {
    return this.usersService.singIn(payload);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@UserId() userId: string, @Res() res: any) {
    res.clearCookie('_rt');

    const response = await this.usersService.logout({ userId });

    return res.status(HttpStatus.OK).json(response);
  }
}
