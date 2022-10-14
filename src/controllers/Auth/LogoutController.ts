import { errorObj, successObj } from "../../lib/helpers/jsonResHelper.js";
import {
	csrfCookieDefaultCnf,	
	jwtRedisSessionPrefix,
	jwtRefreshTokenBrowserCookiePrefix,
	refreshTokenCookieDefaultCnf,
	jwtAccessTokenBrowserCookiePrefix,
	accessTokenCookieDefaultCnf

} from "../../config/cookies/cookies.js";
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";
import { createRedisClient } from "../../lib/db/redis/client/client.js";

import { CookieOptions, Request, Response } from "express";

import { setLocale } from "../../middleware/setLocale.js";

export const middleware = [setLocale]; // general middlewahre for all functions of ucrrent controller


export async function handleLogout(req: Request, res: Response) {
	
	let refreshToken = req.cookies?.[jwtRefreshTokenBrowserCookiePrefix];
	if (refreshToken) {
		// delete the refresh token from DB
		try {
			let client = await createRedisClient();
			await client.select(0);
			await client.del(`${jwtRedisSessionPrefix}:${refreshToken}`);
		} catch (err: any) {
			throw new Error(err);
		}
	}

	
	let redirectUrl = getNamedRouteUrl(
		req.locale + "_get_home_.index"
	);

	if (req.cookies?.[jwtRefreshTokenBrowserCookiePrefix]) {
		res.clearCookie(
			`${jwtRefreshTokenBrowserCookiePrefix}`,
			refreshTokenCookieDefaultCnf
		);
	}

	if (req.cookies?.[jwtAccessTokenBrowserCookiePrefix]) {
		res.clearCookie(
			`${jwtAccessTokenBrowserCookiePrefix}`,
			accessTokenCookieDefaultCnf
		);
	}

	if (req.cookies?.['os_csrf']) {
		res.clearCookie(
			`os_csrf`,
			csrfCookieDefaultCnf as CookieOptions
		);
	}

	if (req.method === "POST") {
		return res.status(204).json(
			successObj("You have logged out successfully!", {
				redirectUrlOnSuccess: redirectUrl,
			})
		);
	}

	return res.redirect(302, redirectUrl);

	// return res
	// 	.status(204)
	// 	.clearCookie(`${jwtRefreshTokenBrowserCookiePrefix}`, refreshTokenCookieDefaultCnf)
	// 	.clearCookie("os_csrf", csrfCookieDefaultCnf as CookieOptions)
	// 	.json(
	// 		successObj("You have logged out successfully!", {
	// 			redirectUrlOnSuccess: redirectUrlOnSuccess,
	// 		})
	// 	);
}
