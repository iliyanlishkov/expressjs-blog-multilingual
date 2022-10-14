import { Request, Response, NextFunction } from "express";

// we need the path in order to create the alternate urls of the current language
function setPathToLocals(
	req: Request,
	res: Response,
	next: NextFunction
): void {	
	res.locals.urlInfo = {
		originalPath: req.route.path,
		path: req.path,
		params: req.params,
		url: req.url,
	};

	return next();
}

export { setPathToLocals };
