import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { QueryBus } from '@nestjs/cqrs';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IEnvironment } from '@/config/env.interface';
import { IJwtTokenPayload } from '@/interfaces/jwt-token';

import { ValidRefreshTokenContract } from '../queries/contracts/valid-refresh-token.contract';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
	constructor(configService: ConfigService<IEnvironment, true>, private readonly queryBus: QueryBus) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('refreshTokenJwtKey', { infer: true }),
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: IJwtTokenPayload) {
		const refreshToken = request.headers.get('Authorization')!.replace('Bearer ', '');

		const isValidRefreshToken = await this.queryBus.execute<ValidRefreshTokenContract, boolean>(
			new ValidRefreshTokenContract(payload.sub, refreshToken),
		);

		if (!isValidRefreshToken) {
			throw new UnauthorizedException();
		}

		return payload;
	}
}
