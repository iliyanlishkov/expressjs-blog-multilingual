import { ConfObj } from "./configTypes.js";

const config = (configObj: ConfObj | undefined) => {
	return {
		socket: {
			host: (configObj && configObj.host) || process.env.REDIS_HOST,
			port:
				(configObj && configObj.port) ||
				parseInt(process.env.REDIS_PORT as string),
		},
	};
};

export { config };
