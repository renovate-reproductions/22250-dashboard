interface ITokens {
	accessToken: string;
	refreshToken: string;
}

export interface IRegisterResponse extends ITokens {}

export interface ILoginResponse extends ITokens {
	name: string;
}

export interface IRefreshTokenResponse {
	accessToken: string;
}

export interface IAutoLoginResponse {
	accessToken: string;
	name: string;
}
