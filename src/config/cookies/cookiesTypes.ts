export interface CsrfCookieDefaultCnf {
	cookie: {
		key: string;
		secure: boolean;
		httpOnly: boolean;
		sameSite: boolean | "lax" | "strict" | "none" | undefined;
		maxAge: number;
	};
	ignoreMethods: string[];
}

export interface RefreshTokenCookieDefaultCnf {
	secure: boolean
	httpOnly: boolean,
	sameSite: boolean | "lax" | "strict" | "none" | undefined;
}

export interface AccessTokenCookieDefaultCnf {
	secure: boolean
	httpOnly: boolean,
	sameSite: boolean | "lax" | "strict" | "none" | undefined;
}
