import jwt from "jsonwebtoken";
import { generateJWTAccessToken } from "../../lib/auth/jwt/issueJWT.js";
// import { errorObj, successObj } from "../lib/helpers/jsonResHelper.js";
import { createRedisClient } from "../../lib/db/redis/client/client.js";
import { User } from "../../models/user/User.js";

import { Request, Response, NextFunction } from "express";
import { decodedJWT } from "./authTypes.js";

import {
	jwtRedisSessionPrefix,
	jwtRefreshTokenBrowserCookiePrefix,
	jwtAccessTokenBrowserCookiePrefix,
	accessTokenCookieDefaultCnf,
	refreshTokenCookieDefaultCnf,
	accessTokenExp,
} from "../../config/cookies/cookies.js";
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";
import { authFailedRedirectUrl } from "../../config/auth/general.js";

//if authorized it will attach the user info to the request and set the locals.isLoggedIn = true to the response. It will set the Bearer authorization header and if needed it will attach a cookie with the access token
const isAuthenticated = async (
	req: Request,
	res: Response
): Promise<boolean> => {
	try {
		if (req.user) return true; // this means we have already gone through the authorization process from other middleware like setIsLoggedIn middleware before calling the auth middleware and we don't need to verify everything again

		// check for authorization header
		let accessToken: false | string | undefined =
			(req.headers?.authorization as string) ||
			(req.headers?.Authorization as string); // in case the authorization header is written with capital A.
		let setAccessTokenCookie = false; // set Access Token Cookie in case there isn't any authorization header and any access token cookie for the current request
		let authorizationSuccess = false; // added this variable to make it more clear.

		if (!accessToken) {
			if (req.cookies?.[jwtAccessTokenBrowserCookiePrefix]) {
				accessToken = `Bearer ${req.cookies[jwtAccessTokenBrowserCookiePrefix]}`;
			} else if (req.cookies?.[jwtRefreshTokenBrowserCookiePrefix]) {
				// verify refresh token and issue new access token
				accessToken = await reissueAccessTokenViaRefreshToken(
					req.cookies?.[jwtRefreshTokenBrowserCookiePrefix]
				);

				if (accessToken) {
					setAccessTokenCookie = true;
				}

				
			}
		}

		if (accessToken) {
			let decodedJWT = verifyAccessToken(setAccessTokenCookie ? `Bearer ${accessToken}` : accessToken);

			if (decodedJWT) {
				req.headers.authorization = setAccessTokenCookie ? `Bearer ${accessToken}` : accessToken;
				req.user = decodedJWT.user;
				res.locals.isLoggedIn = true;
				if (setAccessTokenCookie) {
					res.cookie(
						`${jwtAccessTokenBrowserCookiePrefix}`,
						accessToken,
						{
							...accessTokenCookieDefaultCnf,
							maxAge: accessTokenExp,
						}
					);
				}
				authorizationSuccess = true;
			}
		}

		return authorizationSuccess;
	} catch (err: any) {
		throw err;
	}
};

// render the 401 page or return 401 json if not authenticated
const notAuthenticated = (res: Response, json?: boolean) => {
	if (json) {
		return res
			.status(401)
			.json("Invalid authentication! Please log in again!");
	}
	return res.status(401).render("pages/401");
};

// AUTH middleware must be called before the ROLES middleware, because it attaches the req.user object which the ROLES middleware uses
const auth = async (redirectToUrlOrReturnErr401?: string | boolean) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let authenticated = await isAuthenticated(req, res);

			if (!authenticated) {
				// if authorization fails
				let typeOfAction = typeof redirectToUrlOrReturnErr401;

				switch (typeOfAction) {
					case "boolean": //if redirectToUrlOrReturnErr401 is boolean it will return 401 not authenticated page or a JSON response;
						clearJWTCookies(req, res);
						if (redirectToUrlOrReturnErr401) {
							// returns json res
							return notAuthenticated(res, true);
						}

						// returns the rendered 401 page
						return notAuthenticated(res);
					case "string": //if url is passed it will redirect to it;
						return redirectOnAuthFailed(
							req,
							res,
							redirectToUrlOrReturnErr401 as string
						);
					default: //if nothing is passed it will redirect to the default login page from the /src/config/auth/general.ts config file
						return redirectOnAuthFailed(req, res);
				}
			}

			return next();
		} catch (err: any) {
			throw err;
		}
	};
};

const setIsLoggedIn = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// this will only set the req.user and req.locals.isLoggedIn and a cookie if necessary and will continue
		await isAuthenticated(req, res);
		return next();
	} catch (err: any) {
		throw err;
	}
};

const guest = (req: Request, res: Response, next: NextFunction) => {
	if (
		!req.headers?.authorization &&
		!req.headers?.Authorization &&
		!req.cookies?.[jwtRefreshTokenBrowserCookiePrefix] &&
		!req.cookies?.[jwtAccessTokenBrowserCookiePrefix]
	) {
		return next();
	}

	//if not guest than redirect him
	let redirectUrl = getNamedRouteUrl(req.locale + "_get_home_.index");
	return res.redirect(302, redirectUrl);
};

// clear jwt cookies
const clearJWTCookies = (req: Request, res: Response) => {
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
};

// on failed authentication
const redirectOnAuthFailed = (
	req: Request,
	res: Response,
	redirectUrl?: string
) => {
	if (!redirectUrl) {
		redirectUrl = authFailedRedirectUrl(req.locale as string);
	}

	clearJWTCookies(req, res);

	return res.redirect(302, redirectUrl);
};

// accepts string which is the Access Token and returns FALSE if validation fails. In case of success it returns the decoded JWT value;
const verifyAccessToken = (
	accessToken: string | undefined | false
): false | decodedJWT => {
	if (
		!accessToken ||
		typeof accessToken === "undefined" ||
		accessToken == "undefined"
	)
		return false;

	let token = accessToken.split(" ");
	if (token[0] === "Bearer" && token[1]?.match(/\S+\.\S+\.\S+/) !== null) {
		try {
			// synchronus way of typing the function as it doesn't make call to DB
			return jwt.verify(
				token[1],
				process.env.ACCESS_TOKEN_SECRET as string
			) as decodedJWT;
		} catch (err: any) {
			return false;
		}
		// async way
		// return jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
		// 	if (err) return false;
		// 	return decoded;
		// });
	} else {
		return false;
	}
};

const reissueAccessTokenViaRefreshToken = async (
	refreshToken: string | undefined
) => {
	// refreshToken must be a string that represents the JWT refresh token extracted form the cookie. This function must return a string with the newly generated Access Token
	if (typeof refreshToken === "undefined" || refreshToken == "undefined")
		return false;

	try {
		let client = await createRedisClient();
		await client.select(0);

		let tokenExists = await client.get(
			`${jwtRedisSessionPrefix}:${refreshToken}`
		);
		if (!tokenExists) return false;

		if (refreshToken.match(/\S+\.\S+\.\S+/) !== null) {
			try {
				// synchronus way of typing the function as it doesn't make call to DB
				let decoded = jwt.verify(
					refreshToken,
					process.env.REFRESH_TOKEN_SECRET as string
				) as decodedJWT;

				if (!decoded.user?.email) return false;

				// get the user info
				let user = await new User().findUserByEmail(decoded.user.email);

				// if user not found reject auth
				if (!user) return false;

				// if user is found attach the roles value to the user object in the access token
				decoded.user.roles = user.roles;

				let accessToken = generateJWTAccessToken(decoded.user);
				return accessToken;
			} catch (err: any) {
				return false;
			}
		} else {
			return false;
		}
	} catch (err: any) {
		throw new Error(err); // TODO test the error handling
	}
};

const notAuthorized = (res: Response, json?: boolean) => {
	if (json) {
		return res.status(403).json("Not authorized access!");
	}
	return res.status(403).render("pages/errors/403");
};

// AUTH middleware must be called before the ROLES middleware, because it attaches the req.user object which is used by the ROLES middleware
const roles = (allowedRoles: number[], json?: boolean) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// verify role
		if (!req?.user?.roles) return notAuthorized(res, json);
		let rolesArray = allowedRoles;
		let roleMatch = req.user.roles
			.map((role) => rolesArray.includes(role))
			.find((val) => val === true);
		if (!roleMatch) return notAuthorized(res, json);
		return next();
	};
};

export { auth, roles, guest, setIsLoggedIn };
