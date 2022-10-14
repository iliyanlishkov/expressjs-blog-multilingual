import { createClient } from "redis";
import { config } from "../config/config.js";

import { ConfObj } from "./clientTypes.js";

const createRedisClient = async (
	configObj?: ConfObj | undefined,
	callback?: Function
) => {
	let client = createClient(config(configObj));

	client.on("error", (err: any
		) => console.log("Redis Client Error", err));

	try {
		await client.connect();
		return client;
	} catch (err: any) {
		throw new Error(err);
	}
};

export { createRedisClient };
