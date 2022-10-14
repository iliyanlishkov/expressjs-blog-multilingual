import { auth, roles } from "../middleware/auth/auth.js";
import { ROLES_LIST } from "../config/roles/roles_list.js";

import { Request, Response, NextFunction } from "express";

import { setLocale } from "../middleware/setLocale.js";
import { setPathToLocals } from "../middleware/locals/setPath.js";

export const middleware = [setLocale, setPathToLocals]; // general middlewahre for all functions of ucrrent controller

index.middleware = [await auth(), roles([ROLES_LIST.admin, ROLES_LIST.user])];
export function index(req: Request, res: Response, next: NextFunction) {
	return res.render("pages/profile");
}

// index.posmiddleware = [];
