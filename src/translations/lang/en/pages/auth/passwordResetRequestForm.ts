export default {
	layoutTitle: "Send reset password link",
	layoutDescription: "Send reset password link",
	title: "Send reset password link",
	resendSuccess:
		"Your password reset link was sent successfully to :email! Please check your spam folder as well!",
	resendBtn: "Send",
	placeholders: {
		email: "Enter your email",
	},
	validation: {
		email: "email",
		userNotFound:
			"The entered email :email does not exists in our records! Please use the registraion form to register!",
		emailNotVerified:
			"The entered email :email is not verified. You need to verify it first before being able to reset the password! Please use our email verification form!",
	},
};
