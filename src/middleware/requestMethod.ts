import { Request, Response, NextFunction } from "express";
import { allowedReqMethods } from "../config/allowedReqMethods.js";

const methodsParser = (req: Request, res: Response, next: NextFunction) => {
	// NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
	if (!allowedReqMethods.includes(req.method)) {
		return res.status(405).send(`${req.method} not allowed.`);
	}

	return next();
};

export { methodsParser };
