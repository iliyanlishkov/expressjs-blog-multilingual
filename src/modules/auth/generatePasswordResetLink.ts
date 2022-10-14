import { passwordResetLinkHashLength } from "../../config/auth/emailPasswordResetLinkConfig.js";
import { randomString } from "../../lib/helpers/general/generalHelper.js";
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";

// generates the password reset link
export const generatePasswordResetLink = (locale: string | undefined) => {
	let hash = randomString(passwordResetLinkHashLength);

	let passwordResetRouteLink =
		process.env.APP_URL +
		getNamedRouteUrl(locale + "_get_password_reset_.passwordResetForm", {
			hash: hash,
		});

	return {
		link: passwordResetRouteLink,
		hash: hash,
	};
};
