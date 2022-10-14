export const emailVerificationLinkRedisPrefix: string =
	"email_verification_link_hash";
export const emailVerificationLinkExp: number = 24 * 60 * 60 * 1000; // 24 hours in ms
export const emailVerificationLinkHashLength: number = 64;
