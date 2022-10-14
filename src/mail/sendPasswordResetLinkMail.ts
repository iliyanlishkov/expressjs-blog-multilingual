import nodemailer from "nodemailer";
import { transporterConfig } from "../config/mail/transporterConfig.js";
import { mailServerConfig } from "../config/mail/mailServerConfig.js";
import { renderFile } from "ejs";
import { setLoggerExtraInfo } from "../lib/logger/logger.js";
import { getTranslationForLocale } from "../lib/locale/locale.js";

export async function sendPasswordResetLinkMail(
	email: string,
	name: string,
	passwordResetLink: string,
	locale: string | undefined
) {
	try {
		let transporter = nodemailer.createTransport(transporterConfig);
		
		let data = await renderFile(
			global.__viewsDirname + "/mail/passwordReset.ejs",
			{
				email: email,
				name: name,
				locale: locale,
				passwordResetLink: passwordResetLink,
				__: getTranslationForLocale,
			}
		);

		let mail = await transporter.sendMail({
			from: {
				name: mailServerConfig.name,
				address: mailServerConfig.from,
			},
			to: [
				{
					name: name ? name : "",
					address: email,
				},
			],
			subject: getTranslationForLocale(
				locale + "/emails/passwordReset.subject"
			),
			text: getTranslationForLocale(
				locale + "/emails/passwordReset.subjectText"
			),
			html: data,
		});

		return mail;
	} catch (err: any) {
		err = setLoggerExtraInfo(err, {
			reason: `There was a problem sending the email to: ${email}`,
		});
		throw err;
	}
}
