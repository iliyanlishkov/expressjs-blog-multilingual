import { Response } from "express";
import {
	generateJWTAccessToken,
	generateJWTRefreshToken,
} from "../../lib/auth/jwt/issueJWT.js";
import {
	UserAccessTokenObject,
	UserRefreshTokenObject,
} from "../../lib/auth/jwt/issueJWTTypes.js";
import { logoutUserFromOtherDevices } from "../../lib/auth/logoutUserFromOtherDevices.js";
import { createRedisClient } from "../../lib/db/redis/client/client.js";
import { RedisClientType } from "redis";
import {
	jwtRefreshTokenBrowserCookiePrefix,
	jwtRedisSessionPrefix,
	refreshTokenCookieDefaultCnf,
	refreshTokenCookieDefaultExp,
	jwtAccessTokenBrowserCookiePrefix,
	accessTokenCookieDefaultCnf,
	accessTokenExp,
} from "../../config/cookies/cookies.js";

export const loginUserByEmailAndRole = async (
	res: Response,
	email: string,
	roles: number[]
) => {
	let user: UserRefreshTokenObject = {
		email: email,
	};

	let refreshToken = generateJWTRefreshToken(user);

	// now we add the roles value to the user object as we only need the roles to be included in the access token

	(user as UserAccessTokenObject).roles = roles;
	let accessToken = generateJWTAccessToken(user as UserAccessTokenObject);

	try {
		let client = await createRedisClient();
		await client.select(0);

		// log out the user from other devices before logging him again
		await logoutUserFromOtherDevices(client as RedisClientType, email);

		await client.set(`${jwtRedisSessionPrefix}:${refreshToken}`, email);
		await client.expire(
			`${jwtRedisSessionPrefix}:${refreshToken}`,
			refreshTokenCookieDefaultExp / 1000
		);
		// console.log("refresh token:   ", refreshToken);
	} catch (err: any) {
		throw new Error(err);
	}

	res.cookie(`${jwtRefreshTokenBrowserCookiePrefix}`, refreshToken, {
		...refreshTokenCookieDefaultCnf,
		maxAge: refreshTokenCookieDefaultExp,
	}); // we need to set the cookie this way to protect against XSS, XST and Man in the middle attacks. JWT must not be stored in localStorage or sessionStorage on the browser

	// we are setting the access token as cookie to avoid reissuing new access token on each request where the Authorization header is not set because we have a usecase where node is handling the front-end and the back-end (because of a SEO reasons) and React is only used for the app part.
	res.cookie(`${jwtAccessTokenBrowserCookiePrefix}`, accessToken, {
		...accessTokenCookieDefaultCnf,
		maxAge: accessTokenExp,
	});

	return accessToken;
};
