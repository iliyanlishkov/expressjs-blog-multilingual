import {
	CsrfCookieDefaultCnf,
	RefreshTokenCookieDefaultCnf,
	AccessTokenCookieDefaultCnf,
} from "./cookiesTypes.js";


const sameSite = 'strict';


export const refreshTokenCookieDefaultExp: number = 14 * 24 * 60 * 60 * 1000; // 14 days
// export const refreshTokenCookieDefaultExp = 2 * 60 * 1000; // 2 minute
export const refreshTokenCookieDefaultCnf: RefreshTokenCookieDefaultCnf = {
	secure: process.env.NODE_ENV !== "development",
	httpOnly: true,
	sameSite: sameSite,
};



export const accessTokenExp = 15 * 60 * 1000; // 5 minutes
// export const accessTokenExp: number = 1 * 60 * 1000; // 1 minute
export const accessTokenCookieDefaultCnf: AccessTokenCookieDefaultCnf = {
	secure: process.env.NODE_ENV !== "development",
	httpOnly: true,
	sameSite: sameSite,
};



// export const csrfCookieDefaultCnfExp = 1 * 60; // 1 minute
export const csrfCookieDefaultCnfExp: number = refreshTokenCookieDefaultExp / 1000; // 14 days`
export const csrfCookieDefaultCnf: CsrfCookieDefaultCnf = {
	cookie: {
		key: "os_csrf",
		secure: process.env.NODE_ENV !== "development",
		httpOnly: true,
		sameSite: sameSite,
		maxAge: csrfCookieDefaultCnfExp,
	},
	ignoreMethods: ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "PATCH"],
};



// cookies prefix
export const jwtRefreshTokenBrowserCookiePrefix: string = "os_rt";
export const jwtAccessTokenBrowserCookiePrefix: string = "os_at";
export const jwtRedisSessionPrefix: string = "os_refresh_jwt";
