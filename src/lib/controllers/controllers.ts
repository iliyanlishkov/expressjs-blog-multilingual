import { requireDir } from "../requireDir/requireDir.js"; //dependency
import { namespace, slashNotation } from "./utils/utils.js";
import { controllersDir } from "../../config/controllers.js";
/**
 * Formats every controller inside the directory 'controllers' into an object.
 * folder:
 *  - app
 *    - auth.controller
 *
 *  output:
 *  {
 *    App: {
 *      AuthController: (file exports)
 *    }
 *  }
 */

const controllers = await requireDir(controllersDir || "./dist/controllers", {
	rename: namespace,
});

/**
 * Transform slash notation to the controller's method, appending/prepending any middleware required
 */

//  interface ObjWithKeyAndObjOrUndefinedValue {
// 	//object type is just an empty object by default. Therefore it isn't possible to use a string type to index {} like a[b]. Now we are telling the compiler the obj argument will be a cpair of string or number as a key and an object as a value or undefined.
// 	// an alternative way is to write this: "<T extends object, U extends keyof T>(b: U) => (a: T) => a[b];"
// 	[key: string | number]: ObjWithKeyAndObjOrUndefinedValue | undefined;
// }

const Ctrlrs = (ctrllr: string) => {
	// TODO add return value of the function

	let [controllerName, methodName] = ctrllr.split("@");
	let controller = slashNotation(controllerName, controllers);
	let method = controller[methodName];

	if (typeof method === "undefined") {
		throw new Error(
			`The method "${methodName}" was not found in the controller "${controllerName}"`
		);
	}

	let { middleware: ctrlrmiddleware = [] } = controller;
	let { middleware = [], posmiddleware = [] } = method;

	return [
		...(<any[]>ctrlrmiddleware),
		...(<any[]>middleware),
		method,
		...(<any[]>posmiddleware),
	];
};

export { Ctrlrs };
