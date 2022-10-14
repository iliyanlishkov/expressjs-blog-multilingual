import { ConfObj } from "../config/configTypes.js";

export interface LooseObject {
	// bject to which we could assign dynamically any variables
	[key: string | number]: any;
}

export { ConfObj };
