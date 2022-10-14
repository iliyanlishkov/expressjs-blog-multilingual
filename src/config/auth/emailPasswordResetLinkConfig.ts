export const passwordResetLinkRedisPrefix: string =
	"email_password_reset_link_hash";
export const passwordResetLinkExp: number = 24 * 60 * 60 * 1000; // 24 hours in ms
export const passwordResetLinkHashLength: number = 64;
