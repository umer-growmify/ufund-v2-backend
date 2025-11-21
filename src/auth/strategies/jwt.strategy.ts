// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { JwtPayload } from '../../types/types';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(private readonly configService: ConfigService) {
//     const secret = configService.get<string>('JWT_SECRET');
//     if (!secret) {
//       throw new Error('JWT_SECRET is not defined');
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           console.log('JwtStrategy - Extracting JWT from request cookies');
//           console.log('JwtStrategy - Request cookies:', request?.cookies);
//           return request?.cookies?.accessToken || request?.cookies?.admin_token;
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: secret,
//     });
//   }

//   async validate(payload: JwtPayload) {
//     console.log('JwtStrategy - JWT Payload:', payload);

//     if (!payload || !payload.sub || !payload.email || !payload.role || !payload.type) {
//       console.error('JwtStrategy - Invalid payload:', payload);
//       throw new UnauthorizedException('Invalid token payload');
//     }

//     return {
//       id: payload.sub,
//       email: payload.email,
//       activeRole: payload.role,
//       type: payload.type,
//     };
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../types/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('JwtStrategy - JWT Secret:', secret);
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      !payload.role ||
      !payload.type
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      activeRole: payload.role,
      type: payload.type,
    };
  }
}
