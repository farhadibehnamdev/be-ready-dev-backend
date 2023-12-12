import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  accessTokenSecret: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<string[]>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.accessTokenSecret,
      });
      request['user'] = payload;
      request['userProfile'] = payload.sub;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromCookies(request: Request): any {
    const token = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];
    // console.log('access token ::', token);
    // console.log('refreshToken ::', refreshToken);
    // console.log(
    //   'request.headers.authorization ::: ',
    //   request.headers.authorization,
    // );
    // const [type, tokenAuth] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
// private extractTokenFromHeader(request: Request): string | undefined {
//   const [type, token] = request.headers.authorization?.split(' ') ?? [];
//   return type === 'Bearer' ? token : undefined;
// }
