import { jwtRedisSessionPrefix } from "../../config/cookies/cookies.js";
import { RedisClientType } from "redis";

const logoutUserFromOtherDevices = async (
	client: RedisClientType,
	email: string
) => {
	try {
		let otherSessions = await client.keys(`${jwtRedisSessionPrefix}:*`);

		for (let i = 0; i < otherSessions.length; i++) {
			let value = await client.get(otherSessions[i]);
			if (value == email) {
				await client.del(otherSessions[i]);
			}
		}
	} catch (err: any) {
		throw err;
	}
};

export { logoutUserFromOtherDevices };
