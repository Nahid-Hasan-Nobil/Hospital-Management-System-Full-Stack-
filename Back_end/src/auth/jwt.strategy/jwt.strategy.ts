import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // Match the secret used when creating the token
    });
  }

  async validate(payload: any) {
    if (payload.email) {
      // This is for the Doctor
      return { userId: payload.sub, email: payload.email };
    } else if (payload.phoneNumber) {
      // This is for the Patient
      return { userId: payload.sub, phoneNumber: payload.phoneNumber };
    }
  }
}
