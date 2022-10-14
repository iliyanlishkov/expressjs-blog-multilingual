import { Response } from "express";
import { errorObj } from "../../lib/helpers/jsonResHelper.js";

const res404 = (res: Response, json?: boolean) => {
	res.status(404);

	if (json) return res.json(errorObj("404", "Page not found!"));

	return res.render("pages/errors/404");
};

export { res404 };
