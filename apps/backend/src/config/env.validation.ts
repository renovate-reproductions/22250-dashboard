import { plainToClass } from 'class-transformer';
import { IsEnum, IsPositive, IsInt, IsString, validateSync } from 'class-validator';

enum Environment {
	Development = 'development',
	Production = 'production',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	public NODE_ENV!: Environment;

	@IsInt()
	@IsPositive()
	public PORT!: number;

	@IsString()
	public ACCESS_TOKEN_JWT_KEY!: string;

	@IsString()
	public REFRESH_TOKEN_JWT_KEY!: string;

	@IsString()
	public GOOGLE_OAUTH_CLIENT_ID!: string;

	@IsString()
	public GOOGLE_OAUTH_CLIENT_SECRET!: string;

	@IsString()
	public GOOGLE_OAUTH_REDIRECT_URI!: string;
}

export const validate = (config: Record<string, unknown>) => {
	const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
};
