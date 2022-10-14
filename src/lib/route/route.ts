import { Router } from "express";
import { Ctrlrs } from "../controllers/controllers.js";
import { getForLocale } from "../locale/locale.js";
import { all_locale, default_locale } from "../../config/locale.js";
import { RoutesObject, RouteGroupsObject } from "./routeTypes.js";
import { allowedReqMethods } from "../../config/allowedReqMethods.js";

const validateRouteParams = (
	method: string,
	pattern: string,
	controller: string,
	name: string
) => {
	let supportedMethods = [
		"get",
		"post",
		"put",
		"delete",
		"patch",
		"head",
		"options",
	];

	if (!supportedMethods.includes(method.toLowerCase())) {
		throw new Error(`Method "${method}" is not supported!`);
	}

	if (typeof pattern === "undefined" || pattern == "undefined" || !pattern) {
		throw new Error(`You need to pass pattern!`);
	}

	if (
		typeof controller === "undefined" ||
		controller == "undefined" ||
		!controller ||
		controller.indexOf("@") < 0
	) {
		throw new Error(
			`Controller must be defined and passed with @ delimeter and method after it!`
		);
	}

	if (
		typeof name === "undefined" ||
		name == "undefined" ||
		!name ||
		name == "" ||
		name.indexOf("undefined") > -1
	) {
		throw new Error(`The route must have a name!`);
	}
};

const setRoute = (
	method: string,
	pattern: string,
	controller: string,
	name: string,
	pathTrace: string
) => {
	validateRouteParams(method, pattern, controller, name);
	let route = {
		method: method.toLowerCase(),
		pattern: pattern,
		controller: controller,
		name: name,
		pathTrace: pathTrace,
	};

	/*
		** The global.namedRoutes array could be retrieved from anywhere in your app. 
		** The `global.namedRoutes` is declared at the moment we have registered the named routes during the initialization of the app 
		** which means this happens only once on app start after all the registered routes are parsed. 
	*/
	if (!global.namedRoutes) {
		global.namedRoutes = [route];
	} else {
		global.namedRoutes = [...global.namedRoutes, ...[route]];
	}

	return route;
};

const setNamedRoutes = (...routes: RoutesObject[]) => {
	let namedRoutesArray = [];
	for (let p = 0; p < routes.length; p++) {
		namedRoutesArray.push(
			setRoute(
				routes[p].method,
				routes[p].path,
				routes[p].controller,
				routes[p].name,
				routes[p].path
			)
		);
	}
	return namedRoutesArray;
};

const setNamedRoutesLocalized = (...routes: RoutesObject[]) => {
	let namedRoutesArray = [];

	for (let i = 0; i < all_locale.length; i++) {
		let prefix = "/" + all_locale[i];
		if (prefix === "/" + default_locale) {
			prefix = "";
		}

		for (let p = 0; p < routes.length; p++) {
			let path = getForLocale(all_locale[i] + "/" + routes[p].path);

			// this is to avoid registering /bg and /bg/ as a valid route.
			if (all_locale[i] != default_locale && path == "/") {
				path = "";
			}

			if (path || path === "") {
				let route = setRoute(
					routes[p].method,
					prefix + path,
					routes[p].controller,
					all_locale[i] + routes[p].name,
					routes[p].path
				);
				namedRoutesArray.push(route);
			}
		}
	}

	return namedRoutesArray;
};

const registerRouteGroups = (...routeGroups: RouteGroupsObject[][]) => {
	let router = Router();
	for (let i = 0; i < routeGroups.length; i++) {
		for (let p = 0; p < routeGroups[i].length; p++) {
			let route = routeGroups[i][p];
			let reqMethod = route.method.toUpperCase();

			if (allowedReqMethods.includes(reqMethod)) {
				switch (reqMethod) {
					case "POST":
						router.post(route.pattern, Ctrlrs(route.controller));
					case "GET":
						router.get(route.pattern, Ctrlrs(route.controller));
					case "HEAD":
						router.head(route.pattern, Ctrlrs(route.controller));
					case "PUT":
						router.put(route.pattern, Ctrlrs(route.controller));
					case "DELETE":
						router.delete(route.pattern, Ctrlrs(route.controller));
					case "CONNECT":
						router.connect(route.pattern, Ctrlrs(route.controller));
					case "OPTIONS":
						router.options(route.pattern, Ctrlrs(route.controller));
					case "TRACE":
						router.trace(route.pattern, Ctrlrs(route.controller));
					case "PATCH":
						router.patch(route.pattern, Ctrlrs(route.controller));
					default: // get
						router.get(route.pattern, Ctrlrs(route.controller));
				}
			}
		}
	}

	return router;
};

const namedRoutes = (routes: RoutesObject[]) => {
	let prefixedWithLocaleRoutesGroup: RoutesObject[] = [];
	let nonPrefixedRoutesGroup: RoutesObject[] = [];

	for (let i = 0; i < routes.length; i++) {
		if (routes[i].path.indexOf(".") > -1) {
			// it means we are getting the route path from the translation files
			prefixedWithLocaleRoutesGroup.push(routes[i]);
		} else {
			// it means we are directly passing the path without searching for it in the translation files
			nonPrefixedRoutesGroup.push(routes[i]);
		}
	}

	let prefixedGroup = setNamedRoutesLocalized(
		...prefixedWithLocaleRoutesGroup
	);
	let nonPrefixedGroup = setNamedRoutes(...nonPrefixedRoutesGroup);

	let allRoutes = registerRouteGroups(prefixedGroup, nonPrefixedGroup);

	return allRoutes;
};

export {
	setRoute,
	setNamedRoutesLocalized,
	setNamedRoutes,
	registerRouteGroups,
	namedRoutes,
};
