export default {
	layoutTitle: "Reset password form",
	layoutDescription: "Reset password form",
	title: "Reset password form",
	resetPasswordSuccess:
		"The password for user with email :email was updated successfully",
	resetBtn: "Save",
	placeholders: {
		newPassword: "Enter the new password",
		confirmPassword: "Enter again the new password",
	},
	validation: {
		hash: "hash",
		password: "password",
		confirmPassword:
			"The entered passwords in both fields must be the same!",
		invalidHash:
			"The password reset link has expired or is invalid. Please request a neow one.",
		blockedUser: "Your account is restricted!",
		userNotFound:
			"The user with email :email was not found in our database!",
	},
};
