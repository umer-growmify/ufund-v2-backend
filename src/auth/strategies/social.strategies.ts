import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
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
import { Strategy as TwitterOAuthStrategy, Profile } from 'passport-twitter-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyBase, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_REDIRECT'),
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
export class FacebookStrategy extends PassportStrategy(FacebookStrategyBase, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('FB_CLIENT_ID'),
      clientSecret: configService.get('FB_CLIENT_SECRET'),
      callbackURL: configService.get('FB_REDIRECT'),
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

    done(null, { provider: 'facebook', providerId, email, firstName, lastName });
  }
}

@Injectable()
export class LinkedInStrategy extends PassportStrategy(LinkedInStrategyBase, 'linkedin') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get('LINKEDIN_REDIRECT'),
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

    done(null, { provider: 'linkedin', providerId, email, firstName, lastName });
  }
}

@Injectable()
export class TwitterStrategy extends PassportStrategy(TwitterOAuthStrategy, 'twitter') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('TWITTER_CLIENT_ID'),
      clientSecret: configService.get('TWITTER_CLIENT_SECRET'),
      callbackURL: configService.get('TWITTER_REDIRECT'),
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
    const [firstName, ...lastNameParts] = displayName?.split(' ') || ['TwitterUser'];
    const lastName = lastNameParts.join(' ');

    done(null, { provider: 'twitter', providerId, email, firstName, lastName });
  }
}