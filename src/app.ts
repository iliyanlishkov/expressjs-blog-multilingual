import { Request, Response, NextFunction } from "express";
// import * as dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.__viewsDirname = path.resolve(__dirname, "../src/views");
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import http2Express from "http2-express-bridge";
import fs from "fs";
import http2 from "http2";
import compression from "compression";
import localizedRoutes from "./routes/localized.js";
import adminRoutes from "./routes/admin.js";
import apiRoutes from "./routes/api.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import { getNamedRouteUrl } from "./lib/route/getNamedRouteUrl/getNamedRouteUrl.js";
import { namedRoutes } from "./lib/route/route.js";
import {
	getTranslationForLocale,
	getTranslationWithReplacedParams,
} from "./lib/locale/locale.js";

import { logger, setLoggerExtraInfo } from "./lib/logger/logger.js";
import { errorObj } from "./lib/helpers/jsonResHelper.js";
import { createPaginationArr } from "./lib/helpers/pagination/paginationHelper.js";
import { getAlternateLanguagesUrls } from "./lib/helpers/localization/getAlternateLanguagesUrls.js";
import { credentials } from "./middleware/credentials.js";



import cookieParser from "cookie-parser";
import { methodsParser } from "./middleware/requestMethod.js";
import { corsOptions } from "./config/cors/corsOptions.js";
import { setIsLoggedIn } from "./middleware/auth/auth.js";
import { setLocale } from "./middleware/setLocale.js";
import { res404 } from "./modules/errors/res404.js";
import { terminate } from "./lib/errors/terminate.js";



// Create the Express application
const app = http2Express(express);

// add keys
const options = {
	key: fs.readFileSync(path.resolve(__dirname, "../src/keys/localhost.key")),
	cert: fs.readFileSync(path.resolve(__dirname, "../src/keys/localhost.crt")),
	allowHTTP1: true
}

// Remove the X-Powered-By header
app.disable('x-powered-by');

/**
 * ----------- GENERAL MIDDLEWARES -------------
 */
app.use(methodsParser);
app.use(cookieParser());
// app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// credentials middleware must be used before cors;
app.use(credentials);
app.use(cors(corsOptions));

/**
 * ------------- HELPERS ----------------
 */

// appends global function to get translation from any file
app.locals.__ = getTranslationForLocale;
app.locals.___ = getTranslationWithReplacedParams;
app.locals.helpers = {};
app.locals.helpers.createPaginationArr = createPaginationArr;
app.locals.helpers.getAlternateLanguagesUrls = getAlternateLanguagesUrls;
// appends global function to get named routes url by passing a name and args to the function
app.locals.route = getNamedRouteUrl;

/**
 * -------------- ROUTES ----------------
 */
app.set("views", global.__viewsDirname);
app.set("view engine", "ejs");

app.use("/api", apiRoutes);
app.use(namedRoutes(authRoutes));
app.use(namedRoutes(localizedRoutes));
app.use(namedRoutes(adminRoutes));
// console.log(routes.stack); // list all routes

// /* public files */
app.use(express.static(path.resolve(__dirname, "../public")));



/* OPERATIONAL ERRORS HANDLER */

/*
GLOBAL errors handler that catches all operational errors like:
- failed to connect to server; 
- failed to resolve hostname; 
- invalid user input;
- request timeout; 
- server returned a 500 response; 
- socket hang-up; system is out of memory;
*/
app.use((err: any, req: Request, res: Response, next: NextFunction) => {

	err = setLoggerExtraInfo(err, {
		err_code: err.code,
		err_status: err.statusCode,
		res_statusMessage: res.statusMessage,
		req_originalUrl: req.originalUrl,
		req_method: req.method,
		req_ip: req.ip,
	});

	logger.error(err);

	if (err.code === "EBADCSRFTOKEN") {
		// handle invalid csrf token
		return res
			.status(403)
			.json(
				errorObj(
					"Internal server error!",
					"CSRF Token Expired! You have 14 days to complete the request after reloading the page!"
				)
			);
	}

	return res
		.status(err.status || 500)
		.json(
			errorObj(
				"Internal server error!",
				"Failed because of internal server error. Please try again later or contact customer support!"
			)
		);
});

// Global page not found 404 handler
app.use(
	setLocale, // to have localized 404 error page
	setIsLoggedIn, // to know if the login/register and etc buttons should be displayed
	(req: Request, res: Response, next: NextFunction) => {
		return res404(res, req.return404JSON);
	}
);


/**
 * -------------- SERVER ----------------
*/
// Server listens on https://localhost:3000
// app.listen returns http.Server which we will use to handle the programming errors
const server = http2.createSecureServer(options, app).listen(process.env.APP_PORT, () => {
	console.log(`Server started at port: ${process.env.APP_PORT}`);
});


/* PROGRAMMING ERRORS HANDLER */


// const exitHandler = function(a:number, b: string){return true};
const exitHandler = terminate(server, {
	coredump: false,
	timeout: 500,
});

/* 
When a JavaScript error is not properly handled, an uncaughtException is emitted. This is for programmers errors like: 
- called an asynchronous function without a callback; 
- did not resolve a promise; 
- did not catch a rejected promise; 
- passed a string where an object was expected; 
- passed an object where a string was expected; 
- passed incorrect parameters in a function; 
*/
process.on("uncaughtException", exitHandler(1, "uncaughtException"));




/*
An unhandledRejection error is a newer concept. It is emitted when a promise is not satisfied; in other words, a promise was rejected (it failed), and there was no handler attached to respond. These errors can indicate an operational error or a programmer error, and they should also be treated as high priority.
*/
process.on("unhandledRejection", exitHandler(1, "unhandledRejection"));




/* Your operating system emits events to your Node.js process, too, depending on the circumstances occurring outside of your program. These are referred to as signals. Two of the more common signals are SIGTERM and SIGINT. */

/* SIGTERM is normally sent by a process monitor to tell Node.js to expect a successful termination. If you're running systemd or upstart to manage your Node application, and you stop the service, it sends a SIGTERM event so that you can handle the process shutdown. */
process.on("SIGTERM", exitHandler(0, "SIGTERM"));

/* SIGINT is emitted when a Node.js process is interrupted, usually as the result of a control-C (^-C) keyboard event. You can also capture that event and do some work around it. */
process.on("SIGINT", exitHandler(0, "SIGINT"));
