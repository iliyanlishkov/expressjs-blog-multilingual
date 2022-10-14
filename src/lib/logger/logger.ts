import { createLogger, format, transports } from "winston";
import {
	errorsDir,
	exceptionsDir,
	rejectionsDir,
	osSignalsDir,
} from "../../config/errors.js";
import { LoggerObjExtraInfoType, Logger } from "./loggerTypes.js";

const setLoggerExtraInfo = (
	err: Logger,
	obj: LoggerObjExtraInfoType
): LoggerObjExtraInfoType => {
	// this function appends the "extraInfo" object to the "error" object and makes sure not to overide the entire "extraInfo" if for the same error we want to pass information multiple times from different places in the code to the "extraInfo" object
	// if (typeof err !== "object") err = new Error("Something wen't wrong, but you have passed an object that is not an ERROR object as well in the setLoggerExtraInfo() function!");
	// if (typeof obj !== "object") return err;
	if (typeof err.extraInfo === "undefined") {
		err.extraInfo = {};
	}

	let objKeys = Object.keys(obj);
	for (let i = 0; i < objKeys.length; i++) {
		err.extraInfo[
			typeof err.extraInfo[objKeys[i]] !== "undefined"
				? objKeys[i] + "-copy-" + Math.floor(Math.random() * 1000)
				: objKeys[i]
		] = obj[objKeys[i]];
	}

	return err;
};

// format the extra error properties
const displayStack = format((info, opts) => {
	info.message = info.stack ? info.stack + "\n" : info.message + "\n";
	info.message = info.extraInfo
		? info.message + "\nextraInfo:" + JSON.stringify(info.extraInfo)
		: info.message;

	return info;
});

/* logging format */
const myFormat = format.printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}:\n ${message}`;
});

/* filters to log each error level in a different file */
const errorFilter = format((info, opts) => {
	return info.level === "error" && process.env.NODE_ENV == "production"
		? info
		: false;
});

const warnFilter = format((info, opts) => {
	return info.level === "warn" && process.env.NODE_ENV == "production"
		? info
		: false;
});

const debugFilter = format((info, opts) => {
	return info.level === "debug" && process.env.NODE_ENV == "production"
		? info
		: false;
});

const infoFilter = format((info, opts) => {
	return info.level === "info" && process.env.NODE_ENV == "production"
		? info
		: false;
});

const consoleLogFilter = format((info, opts) => {
	return process.env.NODE_ENV !== "production"
		? info
		: false;
});

/* logging paths */
// operational errors
const errorsFile = new transports.File({
	filename: errorsDir,
	level: "error",
	format: format.combine(errorFilter()),
});

// unhandled Exceptions
const exceptionsFile = new transports.File({
	filename: exceptionsDir,
	level: "warn",
	format: format.combine(warnFilter()),
});

// unhandled Rejections
const rejectionsFile = new transports.File({
	filename: rejectionsDir,
	level: "debug",
	format: format.combine(debugFilter()),
});

const osSignalsFile = new transports.File({
	filename: osSignalsDir,
	level: "info",
	format: format.combine(infoFilter()),
});

const consoleLog = new transports.Console({
	level: "silly",
	format: format.combine(consoleLogFilter()),
});

/* creation of the logger   */
const logger = createLogger({
	format: format.combine(
		format.label({ label: "ERROR CAUGHT" }),
		displayStack(),
		format.timestamp(),
		myFormat
	),

	exitOnError: false,
	silent: false,

	transports: [
		errorsFile,
		exceptionsFile,
		rejectionsFile,
		osSignalsFile,
		consoleLog,
	],
});

logger.on("error", function (err) {
	console.error("There was a problem with winston logger! ", err);
});

export { logger, setLoggerExtraInfo };
