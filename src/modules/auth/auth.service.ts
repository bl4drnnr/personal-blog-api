import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import { ApiConfigService } from '@shared/config.service';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from '@models/session.model';
import { User } from '@models/user.model';
import { ExpiredTokenException } from '@exceptions/expired-token.exception';
import { InvalidTokenException } from '@exceptions/invalid-token.exception';
import { SessionHasExpiredException } from '@exceptions/session-expired.exception';
import { CorruptedTokenException } from '@exceptions/corrupted-token.exception';
import { AccessTokenDto } from '@dto/access-token.dto';
import { RefreshTokenDto } from '@dto/refresh-token.dto';
import { TokenPayloadDto } from '@dto/token-payload.dto';
import { Token } from '@enums/tokens.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    @InjectModel(Session) private sessionRepository: typeof Session,
    @InjectModel(User) private userRepository: typeof User
  ) {}

  private generateAccessToken(accessToken: AccessTokenDto) {
    const payload = {
      userId: accessToken.userId,
      email: accessToken.email,
      type: Token.ACCESS
    };
    const options = {
      expiresIn: this.configService.jwtAuthConfig.accessExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken() {
    const id = uuid.v4();
    const payload = { id, type: Token.REFRESH };
    const options = {
      expiresIn: this.configService.jwtAuthConfig.refreshExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return { id, token: this.jwtService.sign(payload, options) };
  }

  private async updateRefreshToken(refreshToken: RefreshTokenDto) {
    const currentSession = await this.sessionRepository.findOne({
      where: { userId: refreshToken.userId }
    });
    if (currentSession) {
      await this.sessionRepository.destroy({
        where: { id: currentSession.id }
      });
    }

    return await this.sessionRepository.create({
      ...refreshToken
    });
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.jwtAuthConfig.secret
      });
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError)
        throw new ExpiredTokenException();
      else if (error instanceof jwt.JsonWebTokenError)
        throw new InvalidTokenException();
      else throw new SessionHasExpiredException();
    }
  }

  async getTokenById(tokenId: string) {
    return this.sessionRepository.findOne({
      where: { tokenId }
    });
  }

  async updateTokens(token: AccessTokenDto) {
    const accessToken = this.generateAccessToken(token);
    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId: token.userId,
      tokenId: refreshToken.id
    });

    return { _at: accessToken, _rt: refreshToken.token };
  }

  async refreshToken(tokenRefresh: string) {
    if (!tokenRefresh) throw new CorruptedTokenException();

    const payload: TokenPayloadDto = this.verifyToken(tokenRefresh);

    const token = await this.getTokenById(payload.id);

    const user = await this.userRepository.findOne({
      where: { id: token.userId }
    });

    const { _at, _rt } = await this.updateTokens({
      userId: user.id,
      email: user.email
    });

    return { _at, _rt };
  }

  async deleteRefreshToken(userId: string) {
    return await this.sessionRepository.destroy({ where: { userId } });
  }
}
