declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: string;
			readonly PORT: string;
			readonly ACCESS_TOKEN_JWT_KEY: string;
			readonly REFRESH_TOKEN_JWT_KEY: string;
			readonly GOOGLE_OAUTH_CLIENT_ID: string;
			readonly GOOGLE_OAUTH_CLIENT_SECRET: string;
			readonly GOOGLE_OAUTH_REDIRECT_URI: string;
		}
	}
}

export {};
