import { Request, Response, NextFunction } from "express";
import { all_locale, default_locale } from "../config/locale.js";

function setLocale(req: Request, res: Response, next: NextFunction): void {
	let split = req.url.split("/");

	if (
		split.length > 1 &&
		split[1].length == 2 &&
		all_locale.indexOf(split[1]) !== -1
	) {
		res.locals.locale = split[1];
		req.locale = split[1];
	} else {
		/*	
			**	In case we are not making a request to a url like /bg/something where we are sure we want BG language,
			**	we will check for header "Request-Language" and set the locale to it if it exists.
			**	If "Request-Language" header is not set or it doesn't meet the conditions we will set the default locale.
			**	This feature is for cases when for example we don't want to define a POST route for each language /register; /bg/register; /de/register and etc.
			**	and keep our routes clear by defining only "/register" route where if we need to make a form validation for example and localize the returned error messages, we will need to know the locale.
		*/
		let reqLang = req.get("Request-Language");
		if (
			reqLang &&
			reqLang.length == 2 &&
			all_locale.indexOf(reqLang) > -1
		) {
			res.locals.locale = reqLang;
			req.locale = reqLang;
		} else {
			res.locals.locale = default_locale;
			req.locale = default_locale;
		}
	}
	return next();
}

export { setLocale };
