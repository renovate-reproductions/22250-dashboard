import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Public } from '@/decorators/public.decorator';

import { AuthService } from './auth.service';
import { RegisterDto } from './classes/register.dto';
import { IRegisterResponse } from './interfaces/responses';
import { EmailExistsContract } from './queries/contracts/email-exists.contract';
import { AddRefreshTokenContract } from './commands/contracts/add-refresh-token.contract';
import { CreateLocalUserContract } from './queries/contracts/create-local-user.contract';

@Controller('auth')
export class RegisterController {
	private readonly logger = new Logger(RegisterController.name);

	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
		private readonly authService: AuthService,
	) {}

	@Public()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	public async register(@Body() registerDto: RegisterDto): Promise<IRegisterResponse> {
		this.logger.log(
			`Will check if user already exists with email: "${registerDto.email}" and name: "${registerDto.name}"`,
		);

		const emailExists = await this.queryBus.execute<EmailExistsContract, boolean>(
			new EmailExistsContract(registerDto.email),
		);

		if (emailExists) {
			this.logger.log(`Provided email already exists: ${registerDto.email}`);

			throw new BadRequestException();
		}

		this.logger.log(
			`Will try to register a user with email: "${registerDto.email}" and name: "${registerDto.name}"`,
		);

		const createdLocalUserId = await this.queryBus.execute<CreateLocalUserContract, string>(
			new CreateLocalUserContract(registerDto),
		);

		this.logger.log(`Successfully created a user with Id: "${createdLocalUserId}"`);

		const [accessToken, refreshToken] = await this.authService.generateJwtTokens(
			createdLocalUserId,
			registerDto.email,
		);

		this.logger.log('Successfully generated both access and refresh tokens');

		await this.commandBus.execute<AddRefreshTokenContract, void>(
			new AddRefreshTokenContract(createdLocalUserId, refreshToken),
		);

		this.logger.log("Successfully stored the user's refresh token");

		return {
			accessToken,
			refreshToken,
		};
	}
}
