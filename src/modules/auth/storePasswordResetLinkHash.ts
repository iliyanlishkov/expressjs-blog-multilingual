import { createRedisClient } from "../../lib/db/redis/client/client.js";
import {
	passwordResetLinkExp,
	passwordResetLinkRedisPrefix,
} from "../../config/auth/emailPasswordResetLinkConfig.js";

// stores a cookie with the hash and it's expiration date for the password reset link
export const storePasswordResetLinkHash = async (
	email: string,
	hash: string
) => {
	try {
		let client = await createRedisClient();
		await client.select(0);

		await client.set(`${passwordResetLinkRedisPrefix}:${hash}`, email);
		await client.expire(
			`${passwordResetLinkRedisPrefix}:${hash}`,
			passwordResetLinkExp / 1000
		);

		return true;
	} catch (err: any) {
		throw new Error(err);
	}
};
