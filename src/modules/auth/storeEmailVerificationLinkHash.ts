import { createRedisClient } from "../../lib/db/redis/client/client.js";
import {
	emailVerificationLinkExp,
	emailVerificationLinkRedisPrefix,
} from "../../config/auth/emailVerificationEmailConfig.js";

// stores a cookie with the hash and it's expiration date for the email verification link
export const storeEmailVerificationLinkHash = async (
	email: string,
	hash: string
) => {
	try {
		let client = await createRedisClient();
		await client.select(0);

		await client.set(`${emailVerificationLinkRedisPrefix}:${hash}`, email);
		await client.expire(
			`${emailVerificationLinkRedisPrefix}:${hash}`,
			emailVerificationLinkExp / 1000
		);

		return true;
	} catch (err: any) {
		throw new Error(err);
	}
};
