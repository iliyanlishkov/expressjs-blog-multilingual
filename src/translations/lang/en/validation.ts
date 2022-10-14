export default {
	exists: "The :attribute field value is required!",
	string: "The :attribute field value must be a string.",
	email: "The :attribute field value must be a valid email address.",
	between: {
		string: "The :attribute field value must be between :min and :max characters.",
		numeric: "The :attribute field value must be between :min and :max."
	},
	dangerousCodeIncluded: "You have used some malicious characters combination in the :attribute field that might harm the server security. Please review your submitted information and try again!"
};