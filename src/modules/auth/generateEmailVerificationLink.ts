import { emailVerificationLinkHashLength } from "../../config/auth/emailVerificationEmailConfig.js";
import { randomString } from "../../lib/helpers/general/generalHelper.js";
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";

// generates the verification link
export const generateEmailVerificationLink = (locale: string | undefined) => {
	let hash = randomString(emailVerificationLinkHashLength);

	let emailVerificationRouteLink =
		process.env.APP_URL +
		getNamedRouteUrl(
			locale + "_get_email_verification_.emailVerificationLinkCheck",
			{
				hash: hash,
			}
		);

	return {
		link: emailVerificationRouteLink,
		hash: hash,
	};
};
