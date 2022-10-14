import { body } from "express-validator";
import { validate } from "../../middleware/validate.js";
import { getTranslationForLocale } from "../../lib/locale/locale.js";
import { User } from "../../models/user/User.js";
import { errorObj, successObj } from "../../lib/helpers/jsonResHelper.js";
import { logger, setLoggerExtraInfo } from "../../lib/logger/logger.js";
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";
import { DOMPurify } from "../../lib/helpers/purify.js";
import { compare } from "bcrypt";
import { master_password } from "../../config/login.js";
import csrf from "csurf";
import { csrfCookieDefaultCnf } from "../../config/cookies/cookies.js";
import { guest, setIsLoggedIn } from "../../middleware/auth/auth.js";

import { Request, Response, NextFunction } from "express";
import { LooseObject } from "../../models/main/MainTypes.js";

import { setLocale } from "../../middleware/setLocale.js";
import { setPathToLocals } from "../../middleware/locals/setPath.js";
import { loginUserByEmailAndRole } from "../../modules/auth/loginUserByEmailAndRole.js";

import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import passportFacebook from "passport-facebook";
import { ROLES_LIST } from "../../config/roles/roles_list.js";
import { randomString } from "../../lib/helpers/general/generalHelper.js";

import { genSalt, hash } from "bcrypt";

// create the CSRF protection
const csrfProtection = csrf(csrfCookieDefaultCnf);

export const middleware = [setLocale]; // general middlewahre for all functions of ucrrent controller;

// /* GET LOGIN PAGE */
index.middleware = [setPathToLocals, setIsLoggedIn, guest, csrfProtection];
export function index(req: Request, res: Response, next: NextFunction) {
	return res.render("pages/auth/login", { csrfToken: req.csrfToken() });
}

/* POST LOGIN FORM */
handleLoginForm.middleware = [
	csrfProtection,
	await validate([
		body("email")
			.custom((value, { req: Request }) => {
				let clean = DOMPurify.sanitize(value);
				if (
					DOMPurify.removed.length > 0 ||
					(value && value.length > 0 && clean.length == 0)
				) {
					return false;
				}
				return true;
			})
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.dangerousCodeIncluded",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.email"
						),
					}
				);
			})
			.bail()
			.exists()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.exists",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.email"
						),
					}
				);
			})
			.bail()
			.notEmpty()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.exists",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.email"
						),
					}
				);
			})
			.bail()
			.isString()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.string",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.email"
						),
					}
				);
			})
			.bail()
			.isEmail()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.email",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.email"
						),
					}
				);
			})
			.bail()
			.trim()
			.normalizeEmail()
			.isLength({ min: 7, max: 100 })
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.between.string",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.email"
						),
						min: 7,
						max: 100,
					}
				);
			})
			.bail(),
		body("password")
			.custom((value, { req }) => {
				let clean = DOMPurify.sanitize(value);
				if (
					DOMPurify.removed.length > 0 ||
					(value && value.length > 0 && clean.length == 0)
				) {
					return false;
				}
				return true;
			})
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.dangerousCodeIncluded",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.password"
						),
					}
				);
			})
			.bail()
			.exists()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.exists",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.password"
						),
					}
				);
			})
			.bail()
			.notEmpty()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.exists",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.password"
						),
					}
				);
			})
			.bail()
			.isString()
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.string",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.password"
						),
					}
				);
			})
			.bail()
			.isLength({ min: 5, max: 100 })
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.between.string",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/login.validation.password"
						),
						min: 5,
						max: 100,
					}
				);
			})
			.bail()
			.custom(async (value, { req }) => {
				// I know I shouldn't use try catch in a promise but as we have async function inside the promise and I want it to be here it's neccessary to use it
				// try fetch user info
				let user: LooseObject | null = null;
				try {
					user = await new User().findUserByEmail(req.body.email);
				} catch (err: any) {
					err = setLoggerExtraInfo(err, {
						ip: req.ip,
						user: req.body.email,
					});
					logger.error(err);
					throw new Error(
						"Login failed! Please contact customer support! Error code: UB6G4DD0K"
					);
				}

				// if user not found throw error
				if (!user) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/login.validation.emailOrPasswordInvalid"
						)
					);
				}

				// if not verified
				if (!user.verified) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/login.validation.emailNotVerified"
						)
					);
				}

				// if trying to log in with master password
				if (value === master_password) {
					return true;
				}

				// try compare passwords
				let passwordMatch = false;
				try {
					passwordMatch = await compare(value, user.password);
				} catch (err: any) {
					err = setLoggerExtraInfo(err, {
						ip: req.ip,
						user: req.body.email,
					});
					logger.error(err);
					throw new Error(
						"Login failed! Please contact customer support! Error code: JF84JHR764GF63GDS0"
					);
				}

				// if password fon't match throw error
				if (!passwordMatch) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/login.validation.emailOrPasswordInvalid"
						)
					);
				}

				// if validation is successfull, attach the user role info to the request body so we could attach it later to the JWT
				req.body.roles = user.roles;

				return true;
			})
			.bail(),
	]),
];

export async function handleLoginForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let accessToken = await loginUserByEmailAndRole(
			res,
			req.body.email,
			req.body.roles
		);

		let redirectUrlOnSuccess = getNamedRouteUrl(
			req.locale + "_get_profile_.index"
		);

		return res.status(200).json(
			successObj("You have logged in successfully!", {
				accessToken: accessToken,
				redirectUrlOnSuccess: redirectUrlOnSuccess,
			})
		);
	} catch (err: any) {
		throw err;
	}
}

/* START STRATEGY AUTH */
export function handleAllStrategyRedirect(req: Request, res: Response) {
	let redirectUrlOnSuccess = getNamedRouteUrl(
		(req.locale ? req.locale : "en") + "_get_profile_.index"
	);
	return res.send(
		`<script>window.location.href = '${redirectUrlOnSuccess}';</script>`
	);
}

/* START google auth */
handleGoogleAuthRedirect.middleware = [guest];

export async function handleGoogleAuthRedirect(
	req: Request,
	res: Response,
	next: NextFunction
) {
	passport.use(
		new passportGoogle.Strategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL:
					(process.env.APP_URL as string) +
					getNamedRouteUrl(
						"get_googleAuthCallback_.handleGoogleAuthCallback"
					),
			},
			async (accessToken, refreshToken, profile, cb) => {
				let user;
				try {
					// check if there is such user already
					user = await new User().findUserByEmail(
						profile._json.email as string
					);

					// if there isn't such user create one with random password
					if (!user || user.length == 0) {
						user = new User() as LooseObject;
						user.name = profile._json.given_name;
						user.email = profile._json.email;
						user.roles = [ROLES_LIST.user];
						user.verified = true;

						let salt = await genSalt();
						let hashedPassword = await hash(randomString(10), salt);
						user.password = hashedPassword;
						await user.save();
					}
				} catch (err: any) {
					return cb(err);
				}

				return cb(
					null,
					{
						email: user.email,
						roles: user.roles,
					},
					{ locale: req.locale }
				);
			}
		)
	);
	return next();
}

handleGoogleAuthRedirect.posmiddleware = [
	passport.authenticate("google", {
		scope: ["email", "profile"],
		prompt: "select_account",
	}),
];

/* START google redirect route */
handleGoogleAuthCallback.middleware = [
	guest,
	passport.authenticate("google", {
		failureRedirect: "/login",
		session: false,
	}),
];

export async function handleGoogleAuthCallback(req: Request, res: Response) {
	try {
		// this one redirects to handleAllStrategyRedirect from where we are redirecting to the protected page this time with Referal header to the request so the cookies could be read to know if the user is authenticated
		if (
			typeof req.user !== "undefined" &&
			typeof req.user.email !== "undefined" &&
			typeof req.user.roles !== "undefined"
		) {
			await loginUserByEmailAndRole(res, req.user.email, req.user.roles);
		}

		let redirectUrlOnSuccess = getNamedRouteUrl(
			(req.authInfo?.locale ? req.authInfo.locale : "en") +
				"_get_googleStrategyRedirect_.handleAllStrategyRedirect"
		);

		return res.redirect(302, redirectUrlOnSuccess);
	} catch (err: any) {
		throw err;
	}
}

/* START facebook auth */
handleFacebookAuthRedirect.middleware = [guest];

export async function handleFacebookAuthRedirect(
	req: Request,
	res: Response,
	next: NextFunction
) {
	passport.use(
		new passportFacebook.Strategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID as string,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				callbackURL:
					(process.env.APP_URL as string) +
					getNamedRouteUrl(
						"get_facebookAuthCallback_.handleFacebookAuthCallback"
					),
				// profileFields: ['displayName', 'name', 'email']
			},
			async (accessToken, refreshToken, profile, cb) => {
				let user;
				try {
					// check if there is such user already
					user = await new User().findUserByEmail(
						profile._json.email as string
					);

					// if there isn't such user create one with random password
					if (!user || user.length == 0) {
						user = new User() as LooseObject;
						user.name = profile._json.displayName;
						// user.email = profile._json.email; // TODO
						user.email = profile._json.id + "@testfacebbok.bg"; // TODO:  only for testing as if the email of the profile is private we need advanced access which can't be granted for localhost
						user.roles = [ROLES_LIST.user];
						user.verified = true;

						let salt = await genSalt();
						let hashedPassword = await hash(randomString(10), salt);
						user.password = hashedPassword;
						await user.save();
					}
				} catch (err: any) {
					return cb(err);
				}

				return cb(
					null,
					{
						email: user.email,
						roles: user.roles,
					},
					{ locale: req.locale }
				);
			}
		)
	);
	return next();
}

handleFacebookAuthRedirect.posmiddleware = [
	passport.authenticate("facebook", {
		scope: ["id", "displayName"], // only for testing. Switch this to ["email", "displayName"] for production // TODO
		// scope: ["email", "displayName"], // TODO
		// prompt: "select_account",
	}),
];

/* START facebook redirect route */
handleFacebookAuthCallback.middleware = [
	guest,
	passport.authenticate("facebook", {
		failureRedirect: "/login",
		session: false,
	}),
];

export async function handleFacebookAuthCallback(req: Request, res: Response) {
	try {
		// this one redirects to handleAllStrategyRedirect from where we are redirecting to the protected page this time with Referal header to the request so the cookies could be read to know if the user is authenticated
		if (
			typeof req.user !== "undefined" &&
			typeof req.user.email !== "undefined" &&
			typeof req.user.roles !== "undefined"
		) {
			await loginUserByEmailAndRole(res, req.user.email, req.user.roles);
		}

		let redirectUrlOnSuccess = getNamedRouteUrl(
			(req.authInfo?.locale ? req.authInfo.locale : "en") +
				"_get_facebookStrategyRedirect_.handleAllStrategyRedirect"
		);

		return res.redirect(302, redirectUrlOnSuccess);
	} catch (err: any) {
		throw err;
	}
}
