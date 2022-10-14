const transporterConfig = {
	host: process.env.MAIL_HOST || "smtp.mailtrap.io",
	port: parseInt(process.env.MAIL_PORT as string) || 587,
	auth: {
		user: process.env.MAIL_USERNAME || "69bb7151999b69",
		pass: process.env.MAIL_PASSWORD || "31b1685ff63d49",
	},
	secure: process.env.MAIL_ENCRYPTION == "tls" ? true : false,
};

export { transporterConfig };
