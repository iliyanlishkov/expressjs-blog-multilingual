import cors from "cors";
import { allowedOrigins } from "./allowedOrigins.js";
import { allowedReqMethods } from "../allowedReqMethods.js";

const corsOptions: cors.CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.indexOf(origin as string) !== -1) {
			// for localhost there isn't any origin
			callback(null, true);
		} else {
			callback(new Error(`Not allowed by CORS`));
		}
	},
	methods: allowedReqMethods,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export { corsOptions };
