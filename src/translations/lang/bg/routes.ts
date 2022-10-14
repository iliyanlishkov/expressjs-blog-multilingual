export default {
	home: "/", //get
	register: "/register", //get
	login: "/login", //get
	passwordResetRequestForm: "/password-reset", //get
	passwordResetForm: "/auth/password-reset/:hash", //get
	profile: "/profile", //get
	logout: "/logout", //get
	blogArchive: "/blog", //get
	singleBlogPost: "/blog/:slug", //get
	auth: {
		google: "/auth/google", // get
		facebook: "/auth/facebook", // get
		strategy: "/auth/strategy/redirect", //get
	},
	resendEmailVerificationLinkForm: "/email-verify", //get
	emailVerificationLinkCheck: "/auth/email-verify/:hash", //get
};
