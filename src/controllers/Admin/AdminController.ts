import { Request, Response, NextFunction } from "express";

export const middleware = [];

// index.middleware = [];

export function index(req: Request, res: Response, next: NextFunction) {
	return res.send("<h1>Admin page</h2>");
}

// index.posmiddleware = [];
