import { Request, Response, NextFunction } from "express";
import { emailVerificationLinkRedisPrefix } from "../../config/auth/emailVerificationEmailConfig.js";
import { createRedisClient } from "../../lib/db/redis/client/client.js";
import { logger, setLoggerExtraInfo } from "../../lib/logger/logger.js";
import { validate } from "../../middleware/validate.js";
import { body } from "express-validator";
import { DOMPurify } from "../../lib/helpers/purify.js";

import { guest, setIsLoggedIn } from "../../middleware/auth/auth.js";
import { setPathToLocals } from "../../middleware/locals/setPath.js";
import { setLocale } from "../../middleware/setLocale.js";
import { User } from "../../models/user/User.js";
import csrf from "csurf";
import { csrfCookieDefaultCnf } from "../../config/cookies/cookies.js";
import { getTranslationForLocale } from "../../lib/locale/locale.js";
import { LooseObject } from "../../models/main/MainTypes.js";
import { errorObj, successObj } from "../../lib/helpers/jsonResHelper.js";
import { sendVerifyEmailMail } from "../../mail/sendVerifyEmailMail.js";
import { generatePasswordResetLink } from "../../modules/auth/generatePasswordResetLink.js";
import { storePasswordResetLinkHash } from "../../modules/auth/storePasswordResetLinkHash.js";
import { sendPasswordResetLinkMail } from "../../mail/sendPasswordResetLinkMail.js";
import {
	passwordResetLinkHashLength,
	passwordResetLinkRedisPrefix,
} from "../../config/auth/emailPasswordResetLinkConfig.js";
import { genSalt, hash } from "bcrypt";
import { ROLES_LIST } from "../../config/roles/roles_list.js";
// import { loginUserByEmailAndRole } from "../../modules/auth/loginUserByEmailAndRole.js";
// import pg from 'pg';

// the page for requesting new verification link
const csrfProtection = csrf(csrfCookieDefaultCnf);
passwordResetRequestForm.middleware = [
	setLocale,
	setPathToLocals,
	setIsLoggedIn,
	guest,
	csrfProtection,
];
export function passwordResetRequestForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return res.render("pages/auth/passwordResetRequestForm", {
		csrfToken: req.csrfToken(),
	});
}

// form to request a password reset link
handlePasswordResetRequestForm.middleware = [
	setLocale,
	guest,
	csrfProtection,
	await validate([
		body("email")
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
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.email"
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
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.email"
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
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.email"
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
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.email"
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
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.email"
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
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.email"
						),
						min: 7,
						max: 100,
					}
				);
			})
			.bail()
			.custom(async (value, { req }) => {
				// I know I shouldn't use try catch in a promise but as we have async function inside the promise and I want it to be here it's neccessary to use it
				let user: LooseObject | null = null;
				try {
					user = await new User().findUserByEmail(value);
				} catch (err: any) {
					err = setLoggerExtraInfo(err, {
						ip: req.ip,
						user: req.body.email,
					});
					logger.error(err);
					throw new Error(
						"Password reset request failed! Please contact customer support! Error code: IIUDUNDUUN8RE2P"
					);
				}

				if (!user) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.userNotFound",
							{
								email: value,
							}
						)
					);
				}

				if (!user.verified) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/passwordResetRequestForm.validation.emailNotVerified",
							{
								email: value,
							}
						)
					);
				}

				// atttach the name tot he body so we don't have to make a call to the DB again in the controller function to send the email
				req.body.name = user.name;
			})
			.bail(),
	]),
];

export async function handlePasswordResetRequestForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// create password reset  link
		let passwordResetLink = generatePasswordResetLink(req.locale);

		// store the password reset link in redis
		await storePasswordResetLinkHash(
			req.body.email,
			passwordResetLink.hash
		);

		// send the email with the  password reset link to the client
		await sendPasswordResetLinkMail(
			req.body.email,
			req.body.name,
			passwordResetLink.link,
			req.locale
		);
	} catch (err: any) {
		err = setLoggerExtraInfo(err, {
			ip: req.ip,
			user: req.body.email,
		});

		logger.error(err);

		return res
			.status(500)
			.json(
				errorObj(
					"Password reset failed!",
					"Failed because of internal server error. Please contact the support team sending the error: '7676765GDDSG'!"
				)
			);
	}

	let successMsg = getTranslationForLocale(
		req.locale + "/pages/auth/passwordResetRequestForm.resendSuccess",
		{
			email: req.body.email,
		}
	);

	return res.status(200).json(
		successObj("Password reset email was sent successfully!", {
			successMsg: successMsg,
		})
	);
}

passwordResetForm.middleware = [
	setLocale,
	guest,
	setIsLoggedIn,
	setPathToLocals,
	csrfProtection,
];
export async function passwordResetForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let isHashValid: string | null = null;

	if (req.params.hash) {
		try {
			let client = await createRedisClient();
			await client.select(0);

			isHashValid = await client.get(
				`${passwordResetLinkRedisPrefix}:${req.params.hash}`
			);
		} catch (err: any) {
			err = setLoggerExtraInfo(err, {
				ip: req.ip,
				hash: req.params.hash,
				isHashValid: isHashValid,
				errCode: "HDHADHGDAUIA717363",
			});

			logger.error(err);
		}
	}

	return res.render("pages/auth/passwordResetForm", {
		email: isHashValid,
		hash: req.params.hash,
		hashLength: passwordResetLinkHashLength,
		csrfToken: req.csrfToken(),
	});
}

handlePasswordResetForm.middleware = [
	setLocale,
	guest,
	await validate([
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.password"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.password"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.password"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.password"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.password"
						),
						min: 5,
						max: 100,
					}
				);
			})
			.bail(),
		body("password_confirm")
			.custom((value, { req }) => {
				return value === req.body.password;
			})
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale +
						"/pages/auth/passwordResetForm.validation.confirmPassword"
				);
			})
			.bail(),
		body("hash")
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.hash"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.hash"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.hash"
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
							req.locale +
								"/pages/auth/passwordResetForm.validation.hash"
						),
					}
				);
			})
			.bail()
			.isLength({
				min: passwordResetLinkHashLength,
				max: passwordResetLinkHashLength,
			})
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.between.string",
					{
						attribute: getTranslationForLocale(
							req.locale +
								"/pages/auth/passwordResetForm.validation.hash"
						),
						min: passwordResetLinkHashLength,
						max: passwordResetLinkHashLength,
					}
				);
			})
			.custom(async (value, { req }) => {
				let isHashValid = null;

				// I know I shouldn't use try catch in a promise but as we have async function inside the promise and I want it to be here it's neccessary to use it
				let client = null;
				try {
					client = await createRedisClient();
					await client.select(0);

					isHashValid = await client.get(
						`${passwordResetLinkRedisPrefix}:${value}`
					);
				} catch (err: any) {
					err = setLoggerExtraInfo(err, {
						ip: req.ip,
						user: isHashValid || req.body.email, // in case there isn't valid session try to get the passed EMAIL value from the form
					});
					logger.error(err);
					throw new Error(
						"Password reset request failed! Please contact customer support! Error code: 676HKJHKJ55439"
					);
				}

				if (!isHashValid) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/passwordResetForm.validation.invalidHash"
						)
					);
				}

				// attach the client to the request so we don't have to make another connection in the controller when the time to delete the session comes if the password reset is completed
				req.redisClient = client;
				req.body.email = isHashValid;
			})
			.bail(),
	]),
];
export async function handlePasswordResetForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let user;
	try {
		user = await new User().findUserByEmail(req.body.email);

		// if for some reason the user was not found
		if (!user) {
			return res.status(500).json(
				errorObj(
					"Password reset failed!",
					getTranslationForLocale(
						req.locale +
							"/pages/auth/passwordResetForm.validation.userNotFound",
						{
							email: req.body.email,
						}
					)
				)
			);
		}

		// if user is blocked reject the password reset
		if (user.roles.includes(ROLES_LIST.blocked)) {
			return res
				.status(500)
				.json(
					errorObj(
						"Password reset failed!",
						getTranslationForLocale(
							req.locale +
								"/pages/auth/passwordResetForm.validation.blockedUser"
						)
					)
				);
		}

		// if user is not blocked, then continue hashing the new password
		let salt = await genSalt();
		let hashedPassword = await hash(req.body.password, salt);
		user.password = hashedPassword;
		await user.update();

		// now when the password was changed successfully  we can delete the session from redis so the reset link will become invalid
		let client = req.redisClient || (await createRedisClient());
		await client.select(0);
		await client.del(`${passwordResetLinkRedisPrefix}:${req.body.hash}`);

		// log in the user
		// await loginUserByEmailAndRole(res, user.email, user.roles);
	} catch (err: any) {
		err = setLoggerExtraInfo(err, {
			ip: req.ip,
			user: req.body.email,
		});

		logger.error(err);

		return res
			.status(500)
			.json(
				errorObj(
					"User registration failed!",
					"Failed because of internal server error. Please contact the support team sending the error: 'KKJDUNVBXVX8B'!"
				)
			);
	}

	let successMsg = getTranslationForLocale(
		req.locale + "/pages/auth/passwordResetForm.resetPasswordSuccess",
		{
			email: req.body.email,
		}
	);

	return res.status(200).json(
		successObj("Password reset was completed successfully!", {
			successMsg: successMsg,
		})
	);
}
