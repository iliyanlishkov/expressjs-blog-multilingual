import { body } from "express-validator";
import { validate } from "../../middleware/validate.js";
import { getTranslationForLocale } from "../../lib/locale/locale.js";
import { User } from "../../models/user/User.js";
import { errorObj, successObj } from "../../lib/helpers/jsonResHelper.js";
import { logger, setLoggerExtraInfo } from "../../lib/logger/logger.js";
import { DOMPurify } from "../../lib/helpers/purify.js";
import { genSalt, hash } from "bcrypt";
import csrf from "csurf";
import { csrfCookieDefaultCnf } from "../../config/cookies/cookies.js";
import { ROLES_LIST } from "../../config/roles/roles_list.js";
import { Request, Response, NextFunction } from "express";
import { LooseObject } from "../../models/main/MainTypes.js";
import { guest, setIsLoggedIn } from "../../middleware/auth/auth.js";

import { setLocale } from "../../middleware/setLocale.js";
import { setPathToLocals } from "../../middleware/locals/setPath.js";
// import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";
// import { loginUserByEmailAndRole } from "../../modules/auth/loginUserByEmailAndRole.js";

import { sendVerifyEmailMail } from "../../mail/sendVerifyEmailMail.js";
import { generateEmailVerificationLink } from "../../modules/auth/generateEmailVerificationLink.js";
import { storeEmailVerificationLinkHash } from "../../modules/auth/storeEmailVerificationLinkHash.js";

// create the CSRF protection
const csrfProtection = csrf(csrfCookieDefaultCnf);

export const middleware = [setLocale];

/* GET REGISTRATION PAGE */
index.middleware = [setPathToLocals, setIsLoggedIn, guest, csrfProtection];

export function index(req: Request, res: Response, next: NextFunction) {
	// try {

	// // let user = await new User().findById(25);
	// let users = await new User(req, res) // we need to pass the req and res here only if we are using pagination
	// 	// .where("email", "=", "gosho8@abv.bg")
	// 	// .where("name", "!=", "gosho")
	// 	.where("email", "LIKE", "%abv.de%")
	// 	// .orWhere("password", "NOT LIKE", "%22%")
	// 	// .where("email", "LIKE", "%f%")
	// 	// .where("name", "LIKE", "%sho%")
	// 	// .orderBy('id', 'desc')
	// 	.orderBy('email', 'asc')
	// 	.paginate(2)
	// 	.get(['id','email']);

	// console.log(user.modelGlobals.queryConditions);

	// console.log("USER name ", user);
	// await user.delete();
	// if(user){
	// 	await user.delete();
	// };

	// user.email = "gosho2@abv.bg";
	// await user.update();
	// console.log(await user.delete());

	// if(await user.update()){
	// 	console.log("update success!");
	// } else {
	// 	console.log("update failed");
	// };
	return res.render("pages/auth/register", { csrfToken: req.csrfToken() });
	// } catch (err) {
	// 	// return res.status(500).json(
	// 	// 	errorObj(
	// 	// 		"User registration failed!",
	// 	// 		"Failed because of internal server error. Please contact the suppor team sending the error: 'HFGS76F'!"
	// 	// 	)
	// 	// );
	// 	return next(err);
	// };
}

// index.posmiddleware = [];

/* POST REGISTRATION FORM */
handleRegistrationForm.middleware = [
	guest,
	csrfProtection,
	await validate([
		body("name")
			.custom((value, { req }) => {
				// if the passed information contains malicious code
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
							req.locale + "/pages/auth/register.validation.name"
						),
					}
				);
			})
			.bail()
			.exists()
			.withMessage((value, { req, location, path }) => {
				// if the attribute "name" exists
				return getTranslationForLocale(
					req.locale + "/validation.exists",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/register.validation.name"
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
							req.locale + "/pages/auth/register.validation.name"
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
							req.locale + "/pages/auth/register.validation.name"
						),
					}
				);
			})
			.bail()
			.trim()
			.isLength({ min: 1, max: 20 })
			.withMessage((value, { req, location, path }) => {
				return getTranslationForLocale(
					req.locale + "/validation.between.string",
					{
						attribute: getTranslationForLocale(
							req.locale + "/pages/auth/register.validation.name"
						),
						min: 1,
						max: 20,
					}
				);
			})
			.bail(),

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
							req.locale + "/pages/auth/register.validation.email"
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
							req.locale + "/pages/auth/register.validation.email"
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
							req.locale + "/pages/auth/register.validation.email"
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
							req.locale + "/pages/auth/register.validation.email"
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
							req.locale + "/pages/auth/register.validation.email"
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
							req.locale + "/pages/auth/register.validation.email"
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
						"Registration failed! Please contact customer support! Error code: N5B37DMFD01745BV6289L"
					);
				}

				if (user) {
					throw new Error(
						getTranslationForLocale(
							req.locale +
								"/pages/auth/register.validation.emailTaken"
						)
					);
				}
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
							req.locale +
								"/pages/auth/register.validation.password"
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
								"/pages/auth/register.validation.password"
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
								"/pages/auth/register.validation.password"
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
								"/pages/auth/register.validation.password"
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
								"/pages/auth/register.validation.password"
						),
						min: 5,
						max: 100,
					}
				);
			})
			.bail(),
	]),
];

export async function handleRegistrationForm(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let user;
	try {
		user = new User() as LooseObject;
		user.name = req.body.name;
		user.email = req.body.email;
		user.roles = [ROLES_LIST.user];

		let salt = await genSalt();
		let hashedPassword = await hash(req.body.password, salt);
		user.password = hashedPassword;
		await user.save();

		// create email verification link
		let emailVerificationLink = generateEmailVerificationLink(req.locale);

		// store the email verification link in redis
		await storeEmailVerificationLinkHash(
			req.body.email,
			emailVerificationLink.hash
		);

		// send the email with the verification link to the client
		await sendVerifyEmailMail(
			user.email,
			user.name,
			emailVerificationLink.link,
			req.locale
		);
	} catch (err: any) {
		err = setLoggerExtraInfo(err, {
			ip: req.ip,
			user: user,
		});

		logger.error(err);

		return res
			.status(500)
			.json(
				errorObj(
					"User registration failed!",
					"Failed because of internal server error. Please contact the support team sending the error: 'HFGS76F'!"
				)
			);
	}

	// let redirectUrlOnSuccess = getNamedRouteUrl(
	// 	req.locale + "_get_profile_.index"
	// );

	// await loginUserByEmailAndRole(res, user.email, user.roles);

	let successMsg = getTranslationForLocale(
		req.locale + "/pages/auth/register.nowVerifyEmail",
		{
			email: user.email,
		}
	);

	return res.status(200).json(
		successObj("User registration completed successfully!", {
			successMsg: successMsg,
		})
	);
}
