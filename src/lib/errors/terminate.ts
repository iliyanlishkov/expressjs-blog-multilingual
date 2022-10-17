import { Http2SecureServer } from "http2";
import { logger } from "../logger/logger.js";

const terminate = (
	server: Http2SecureServer,
	options = { coredump: false, timeout: 500 }
) => {
	// Exit function
	let exit = (code: number) => {
		options.coredump ? process.abort() : process.exit(code);
	};
	

	return (code: number, reason: string) =>
		(err: any, promise: Promise<any>) => {
			switch (reason) {
				case "uncaughtException":
					logger.warn(err); // this will print in exceptions file by default
					break;
				case "unhandledRejection":
					logger.debug(err); // this will print in rejections file by default
					break;
				case "SIGTERM":
					logger.info(err); // this will print in ossignals file by default
					break;
				case "SIGINT":
					logger.info(err); // this will print in ossignals file by default
					break;
				default:
					logger.error(err);
			}

			// Attempt a graceful shutdown
			server.close(() => exit(code)); //stop accepting new connections.

			// If server hasn't finished in 500ms, shut down process
			setTimeout(() => exit(code), options.timeout).unref(); // Prevents the timeout from registering on event loop
		};
};

export { terminate };
