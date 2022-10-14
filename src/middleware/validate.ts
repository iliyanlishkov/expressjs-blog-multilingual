import { ValidationChain, validationResult } from "express-validator";
import { errorObj } from "../lib/helpers/jsonResHelper.js";

import { Request, Response, NextFunction } from "express";

const validate = async (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await Promise.all(
				validations.map((validation: ValidationChain) =>
					validation.run(req)
				)
			);
			let errors = validationResult(req);
			if (errors.isEmpty()) {
				return next();
			}

			return res.status(400).json(
				errorObj(
					"Validation fails!", // general msg
					errors.array() // array with errors. We could pass a single string with error if needed on its place
				)
			);
		} catch (err: any) {
			throw err;
		}
	};
};

export { validate };
