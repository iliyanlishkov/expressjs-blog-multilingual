import express from "express";
import { NamedRoutesObject } from "../../lib/route/routeTypes.js";

interface UserObj {
	email: string;
	roles?: number[];
}

interface AuthInfoExtraInfo {
	locale: string; // we meed it to know on what language to redirect back the client after successfull strategy auth
}

declare global {
	var namedRoutes: NamedRoutesObject[];
	var __viewsDirname: string;
	var db: {
		pool: pg.Pool | null;
	};

	namespace Express {
		interface Request {
			locale?: string;
			redisClient?: RedisClientType;
			return404JSON?: boolean; // TRUE to return a json with 404 error or FALSE to render a page
		}
		interface User extends UserObj {} // we need to do this because Passport attaches user to req.user and overides the interface
		interface AuthInfo extends AuthInfoExtraInfo {} // we need to do this because Passport attaches authInfo to req.authInfo and overides the interface
	}
}
