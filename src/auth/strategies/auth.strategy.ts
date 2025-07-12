import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import {
  Profile,
  Strategy as TwitterOAuthStrategy,
} from 'passport-twitter-oauth2';
import {
  Strategy as GoogleStrategyBase,
  VerifyCallback as GoogleVerifyCallback,
} from 'passport-google-oauth20';
import {
  Strategy as FacebookStrategyBase,
  VerifyCallback as FacebookVerifyCallback,
} from 'passport-facebook';
import {
  Strategy as LinkedInStrategyBase,
  VerifyCallback as LinkedInVerifyCallback,
} from 'passport-linkedin-oauth2';
import { JwtPayload } from 'src/types/types';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleStrategyBase,
  'google',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: GoogleVerifyCallback,
  ) {
    const { id: providerId, name, emails } = profile;
    const email = emails?.[0]?.value;
    const firstName = name?.givenName;
    const lastName = name?.familyName;

    done(null, { provider: 'google', providerId, email, firstName, lastName });
  }
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  FacebookStrategyBase,
  'facebook',
) {
  constructor() {
    super({
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: process.env.FB_REDIRECT,
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: FacebookVerifyCallback,
  ) {
    const { id: providerId, emails, name } = profile;
    const email = emails?.[0]?.value;
    const firstName = name?.givenName;
    const lastName = name?.familyName;

    done(null, {
      provider: 'facebook',
      providerId,
      email,
      firstName,
      lastName,
    });
  }
}

@Injectable()
export class LinkedInStrategy extends PassportStrategy(
  LinkedInStrategyBase,
  'linkedin',
) {
  constructor() {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT,
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: LinkedInVerifyCallback,
  ) {
    const { id: providerId, emails, name } = profile;
    const email = emails?.[0]?.value;
    const firstName = name?.givenName;
    const lastName = name?.familyName;

    done(null, {
      provider: 'linkedin',
      providerId,
      email,
      firstName,
      lastName,
    });
  }
}

@Injectable()
export class TwitterStrategy extends PassportStrategy(
  TwitterOAuthStrategy,
  'twitter',
) {
  constructor() {
    super({
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_REDIRECT,
      scope: ['tweet.read', 'users.read', 'offline.access'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const { id: providerId, displayName, emails } = profile;
    const email = emails?.[0]?.value;
    const [firstName, ...lastNameParts] = displayName?.split(' ') || [
      'TwitterUser',
    ];
    const lastName = lastNameParts.join(' ');

    done(null, {
      provider: 'twitter',
      providerId,
      email,
      firstName,
      lastName,
    });
  }
}

// @Injectable()
// export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
//   constructor() {
//     // Ensure JWT_SECRET is defined
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       throw new Error('JWT_SECRET environment variable is not defined');
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (req) => {
//           return req?.cookies?.token || req.headers.authorization?.split(' ')[1];
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: jwtSecret,  // Now guaranteed to be defined
//     });
//   }

//   async validate(payload: JwtPayload) {
//    return {
//       id: payload.id,
//       activeRole: payload.activeRole,
//       type: payload.type,
//     };
//   }
// }

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase, 'jwt') {
  constructor() {
    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWTFromCookies(req: Request): string | null {
    try {
      // First check for admin token
      if (req.cookies?.admin_token) {
        return req.cookies.admin_token;
      }

      // Then check for regular user token
      if (req.cookies?.token) {
        return req.cookies.token;
      }

      // Check for token in Authorization header as fallback
      if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return authHeader;
      }
    } catch (error) {
      console.error('Error extracting JWT from cookies:', error);
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    // For debugging - remove in production
    console.log(
      `Authenticated ${payload.type} with ID: ${payload.id}, Role: ${payload.activeRole}`,
    );

    return {
      id: payload.id,
      email: payload.email,
      activeRole: payload.activeRole,
      type: payload.type,
    };
  }
}
