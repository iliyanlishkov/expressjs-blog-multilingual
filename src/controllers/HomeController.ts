import { setIsLoggedIn } from "../middleware/auth/auth.js";

import { Request, Response, NextFunction } from "express";

import { setLocale } from "../middleware/setLocale.js";
import { setPathToLocals } from "../middleware/locals/setPath.js";

export const middleware = [setLocale, setPathToLocals, setIsLoggedIn]; // general middlewahre for all functions of ucrrent controller

export function index(req: Request, res: Response, next: NextFunction) {
	return res.render("pages/home");
}

// index.posmiddleware = [];
