import { ConfObj } from "./configTypes.js";

const config = (configObj: ConfObj | undefined) => {
	return {
		user: (configObj && configObj.user) || (process.env.DB_USER as string),
		host: (configObj && configObj.host) || (process.env.DB_HOST as string),
		database:
			(configObj && configObj.name) || (process.env.DB_NAME as string),
		password:
			(configObj && configObj.password) ||
			(process.env.DB_PASSWORD as string),
		port:
			(configObj && configObj.port) ||
			parseInt(process.env.DB_PORT as string),
		idleTimeoutMillis: 30000 as number, // how long a client is allowed to remain idle before being closed
		connectionTimeoutMillis: 2000 as number,
	};
};

export { config };
