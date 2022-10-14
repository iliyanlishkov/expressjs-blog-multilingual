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
import { generateEmailVerificationLink } from "../../modules/auth/generateEmailVerificationLink.js";
import { storeEmailVerificationLinkHash } from "../../modules/auth/storeEmailVerificationLinkHash.js";
// import pg from 'pg';

emailVerificationLinkCheck.emailVerificationLinkCheck = [setLocale, guest];
export async function emailVerificationLinkCheck(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let isHashValid: string | null = null;
	let emailVerified: boolean = false;

	if (req.params.hash) {
		try {
			let client = await createRedisClient();
			await client.select(0);

			isHashValid = await client.get(
				`${emailVerificationLinkRedisPrefix}:${req.params.hash}`
			);
			if (isHashValid) {
				// delete the record from redis and change user VERIFIED to true
				let user = await new User().findUserByEmail(isHashValid);
				
				if (user) {
					if (!user.verified) {
						user.verified = true;
						await user.update();
					}

					await client.del(
						`${emailVerificationLinkRedisPrefix}:${req.params.hash}`
					);

					emailVerified = true;
				}
			}
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

	return res.render("pages/auth/emailVerificationStatus", {
		emailVerified: emailVerified,
		email: isHashValid,
	});
}

// the page for requesting new verification link
const csrfProtection = csrf(csrfCookieDefaultCnf);
resendEmailVerificationLinkForm.middleware = [
	setLocale,
	setPathToLocals,
	setIsLoggedIn,
	guest,
	csrfProtection,
];
export function resendEmailVerificationLinkForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return res.render("pages/auth/resendEmailVerificationLinkForm", {
		csrfToken: req.csrfToken(),
	});
}

// resend the verification link to the user in case it is expired or invalid for some reason

handleResendEmailVerificationLinkForm.middleware = [
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
								"/pages/auth/resendEmailVerificationLinkForm.validation.email"
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
								"/pages/auth/resendEmailVerificationLinkForm.validation.email"
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
								"/pages/auth/resendEmailVerificationLinkForm.validation.email"
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
								"/pages/auth/resendEmailVerificationLinkForm.validation.email"
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
								"/pages/auth/resendEmailVerificationLinkForm.validation.email"
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
								"/pages/auth/resendEmailVerificationLinkForm.validation.email"
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
						"Resend email failed! Please contact customer support! Error code: JKJLKFJFSUFSUYRYBCG765329"
					);
				}

				if (!user) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/resendEmailVerificationLinkForm.validation.userNotFound",
							{
								email: value,
							}
						)
					);
				}

				if (user.verified) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/resendEmailVerificationLinkForm.validation.emailAlreadyVerified",
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

export async function handleResendEmailVerificationLinkForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// create email verification link
		let emailVerificationLink = generateEmailVerificationLink(req.locale);

		// store the email verification link in redis
		await storeEmailVerificationLinkHash(
			req.body.email,
			emailVerificationLink.hash
		);

		// send the email with the verification link to the client
		await sendVerifyEmailMail(
			req.body.email,
			req.body.name,
			emailVerificationLink.link,
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
					"Resend email verification link failed!",
					"Failed because of internal server error. Please contact the support team sending the error: 'JJKFJUI87'!"
				)
			);
	}

	let successMsg = getTranslationForLocale(
		req.locale +
			"/pages/auth/resendEmailVerificationLinkForm.resendSuccess",
		{
			email: req.body.email,
		}
	);

	return res.status(200).json(
		successObj("Email verification link was sent successfully!", {
			successMsg: successMsg,
		})
	);
}
