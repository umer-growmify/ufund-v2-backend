import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter-oauth2';

// Google
import { Strategy as GoogleStrategyBase, VerifyCallback as GoogleVerifyCallback } from 'passport-google-oauth20';

// Facebook
import { Strategy as FacebookStrategyBase, VerifyCallback as FacebookVerifyCallback } from 'passport-facebook';

// LinkedIn
import { Strategy as LinkedInStrategyBase, VerifyCallback as LinkedInVerifyCallback } from 'passport-linkedin-oauth2';

// Twitter



@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyBase, 'google') {
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
export class FacebookStrategy extends PassportStrategy(FacebookStrategyBase, 'facebook') {
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

    done(null, { provider: 'facebook', providerId, email, firstName, lastName });
  }
}

@Injectable()
export class LinkedInStrategy extends PassportStrategy(LinkedInStrategyBase, 'linkedin') {
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

    done(null, { provider: 'linkedin', providerId, email, firstName, lastName });
  }
}

// ✅ Twitter Strategy
@Injectable()
// strategies.ts
@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_REDIRECT,
      scope: ['tweet.read', 'users.read', 'offline.access'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    const { id: providerId, displayName, emails } = profile;
    const email = emails?.[0]?.value;
    const [firstName, ...lastNameParts] = displayName?.split(' ') || ['TwitterUser'];
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