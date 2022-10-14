import { Request, Response, NextFunction } from "express";

import { allowedOrigins } from "../config/cors/allowedOrigins.js";

const credentials = (req: Request, res: Response, next: NextFunction): void => {
	let origin = req.headers.origin;
	if (typeof origin !== "undefined" && allowedOrigins.includes(origin)) {
		res.header("Access-Control-Allow-Credentials", "true");
	}
	return next();
};

export { credentials };
