import { default_locale } from "../../../config/locale.js";
import { RandomObj } from "./getNamedRouteUrlTypes.js";

const getNamedRouteUrl = (
	name: string,
	...args: Array<string | RandomObj>
): string => {
	if (global.namedRoutes) {
		if (name.indexOf("undefined") == 0) {
			name = name.replace("undefined", default_locale);
		}

		for (let i: number = 0; i < global.namedRoutes.length; i++) {
			if (global.namedRoutes[i].name === name) {
				let pattern: string = global.namedRoutes[i].pattern;
				
				if (args) {
					for (let p: number = 0; p < args.length; p++) {
						
						if (typeof args[p] === "object") {
							let keys: string[] = Object.keys(args[p]);

							for (let k: number = 0; k < keys.length; k++) {
								pattern = pattern.replaceAll(
									":" + keys[k].toString(),
									(args[p] as RandomObj)[keys[k]].toString()
								);
							}
						} else if (typeof args[p] === "string"){
							if (pattern.indexOf("?") < 0) {
								pattern += "?" + <string>args[p];
							} else {
								pattern +=
									((<string>args[p]).indexOf("#") == 0
										? ""
										: "&") + args[p];
							}
						}
					}
				}
				return pattern;
			}
		}
	}

	// in case of no matching of url
	return "/";
};

export { getNamedRouteUrl };
