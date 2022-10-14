const passportStrategyPrefix = "/auth";

export default [
	{
		method: "get", // request method
		path: "routes.register", // if we pass the PATH with dot notation the final path will be get from the translations file and a LANG preffix will be attached to the NAME property of the object.
		controller: "Auth/RegisterController@index", // path to the controller
		name: "_get_register_.index", // it must start with underscore
	},
	{
		method: "get",
		path: "routes.login",
		controller: "Auth/LoginController@index",
		name: "_get_login_.index",
	},
	{
		method: "get",
		path: "routes.passwordResetRequestForm",
		controller: "Auth/PasswordResetController@passwordResetRequestForm",
		name: "_get_password_reset_.passwordResetRequestForm",
	},
	{
		method: "post",
		path: "/handle-password-reset-request-form",
		controller:
			"Auth/PasswordResetController@handlePasswordResetRequestForm",
		name: "post_password_reset_request_.handlePasswordResetRequestForm",
	},
	{
		method: "get",
		path: "routes.passwordResetForm",
		controller: "Auth/PasswordResetController@passwordResetForm",
		name: "_get_password_reset_.passwordResetForm",
	},
	{
		method: "post",
		path: "/handle-password-reset-form",
		controller: "Auth/PasswordResetController@handlePasswordResetForm",
		name: "post_password_reset_.handlePasswordResetForm",
	},
	{
		method: "get",
		path: "routes.resendEmailVerificationLinkForm",
		controller:
			"Auth/EmailVerificationController@resendEmailVerificationLinkForm",
		name: "_get_resend_email_verification_.resendEmailVerificationLinkForm",
	},
	{
		method: "get",
		path: "routes.emailVerificationLinkCheck",
		controller:
			"Auth/EmailVerificationController@emailVerificationLinkCheck",
		name: "_get_email_verification_.emailVerificationLinkCheck",
	},

	{
		method: "post",
		path: "/handle-resend-verification-link-form",
		controller:
			"Auth/EmailVerificationController@handleResendEmailVerificationLinkForm",
		name: "post_resend_email_verification_.handleResendEmailVerificationLinkForm",
	},
	{
		method: "post",
		path: "/register", // here we are passing the full path directly and the NAME property wont be prefixed with the LANG string
		controller: "Auth/RegisterController@handleRegistrationForm",
		name: "post_register_.handleRegistrationForm",
	},
	{
		method: "post",
		path: "/login",
		controller: "Auth/LoginController@handleLoginForm",
		name: "post_login_.handleLoginForm",
	},
	{
		method: "get",
		path: "routes.logout",
		controller: "Auth/LogoutController@handleLogout",
		name: "_get_logout_.handleLogout",
	},
	{
		method: "get",
		path: "routes.auth.strategy", // as after google/facebook redirects you to the callback url we have provided we are setting cookie but there isn't any referrer we need to make another redirect this time with a referer
		controller: "Auth/LoginController@handleAllStrategyRedirect",
		name: "_get_googleStrategyRedirect_.handleAllStrategyRedirect",
	},
	{
		method: "get",
		path: "routes.auth.google",
		controller: "Auth/LoginController@handleGoogleAuthRedirect",
		name: "_get_googleAuth_.handleGoogleAuthRedirect",
	},
	{
		method: "get",
		path: passportStrategyPrefix + "/google/callback",
		controller: "Auth/LoginController@handleGoogleAuthCallback",
		name: "get_googleAuthCallback_.handleGoogleAuthCallback",
	},
	{
		method: "get",
		path: "routes.auth.facebook",
		controller: "Auth/LoginController@handleFacebookAuthRedirect",
		name: "_get_facebookAuth_.handleFacebookAuthRedirect",
	},
	{
		method: "get",
		path: passportStrategyPrefix + "/facebook/callback",
		controller: "Auth/LoginController@handleFacebookAuthCallback",
		name: "get_facebookAuthCallback_.handleFacebookAuthCallback",
	},
];
