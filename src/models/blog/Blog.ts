import { Model } from "../main/Main.js";

import { Request, Response } from "express";

class Blog extends Model {
	constructor(req?: Request, res?: Response) {
		super("posts", req, res);
	}
}

export { Blog };
