import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JsonWebToken } from 'src/app/common/domain/json-web-token';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
		});
	}

	validate(payload: JsonWebToken) {
		return payload;
	}
}
