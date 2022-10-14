import { NamedRoutesObject } from "../../../lib/route/routeTypes.js";
import { LooseObject } from "../../../models/main/MainTypes.js";
import {
	AlternateUrlsArr,
	customAlternateUrlsParamsArr,
} from "./getAlternateLanguagesUrlsTypes.js";

import { all_locale } from "../../../config/locale.js";

const getAlternateLanguagesUrls = (
	urlInfo: { originalPath: string; params: LooseObject },
	customParams?: customAlternateUrlsParamsArr | string
): AlternateUrlsArr => {
	
	let alternates: AlternateUrlsArr = [];
	if (typeof urlInfo.originalPath == "undefined" || typeof global?.namedRoutes == "undefined") return alternates;

	let namedRoutes: NamedRoutesObject[] = global.namedRoutes;

	// get the path trace, for example: "routes.blogArchive"
	let pathTrace = "";
	for (let i = 0; i < namedRoutes.length; i++) {
		if (
			namedRoutes[i].method == "get" &&
			namedRoutes[i].pattern == urlInfo.originalPath
		) {
			pathTrace = namedRoutes[i].pathTrace;
			break;
		}
	}
	if (pathTrace == "") return alternates;

	// retrieve the alternate urls and replace the dynamic parameters if such are passed
	let commonCondition =
		urlInfo.params && Object.keys(urlInfo.params).length > 0;

	if (customParams && typeof customParams !== 'string' && commonCondition) {
		customParams.map((params) => {
			// in case we are passing directly custom urls the params.parameters will be a string with the url instead of object
			if (typeof params.parameters === "string") {
				let slug = params.parameters;

				if (params.queryStrings) {
					slug += params.queryStrings;
				}

				alternates.push({
					slug: slug,
					language: params.language,
				});
			} else {
				// in case we are passing only the parameters to replace the dynamic variables in the route patterns
				for (let i = 0; i < namedRoutes.length; i++) {
					let routeLanguage = namedRoutes[i].name.split("_")[0];
					if (
						namedRoutes[i].pathTrace == pathTrace &&
						routeLanguage == params.language
					) {
						let slug = namedRoutes[i].pattern;
						
						Object.keys(urlInfo.params).forEach((key, index) => {
							if (slug.endsWith(`:${key}`)) {
								slug = slug.replace(
									new RegExp(`:` + key + `$`),
									typeof params.parameters[index] !==
										"undefined"
										? params.parameters[index]
										: `:${key}`
								);
							} else {
								slug = slug.replaceAll(
									`:${key}/`,
									(typeof params.parameters[index] !==
									"undefined"
										? params.parameters[index]
										: `:${key}`) + `/`
								);
							}
						});

						if (params.queryStrings) {
							slug += params.queryStrings;
						}

						alternates.push({
							slug: slug,
							language: routeLanguage,
						});
						break;
					}
				}
			}
		});
	} else {
		for (let i = 0; i < namedRoutes.length; i++) {
			if (namedRoutes[i].pathTrace == pathTrace) {
				let slug = namedRoutes[i].pattern;
				let routeLanguage = namedRoutes[i].name.split("_")[0];

				if (commonCondition) {
					Object.keys(urlInfo.params).forEach((key) => {
						if (slug.endsWith(`:${key}`)) {
							slug = slug.replace(
								new RegExp(`:` + key + `$`),
								urlInfo.params[key]
							);
						} else {
							slug = slug.replaceAll(
								`:${key}/`,
								urlInfo.params[key] + `/`
							);
						}
					});
				}

				if(customParams && typeof customParams === 'string') {
					slug += customParams;
				}

				alternates.push({
					slug: slug,
					language: routeLanguage,
				});
			}
		}
	}

	// sort the alternates depending the order of languages in the all_locale array exported from the '/src/config/locale.js'
	if (alternates.length > 0) {
		let sortedAlternates: AlternateUrlsArr = [];
		for (let i = 0; i < all_locale.length; i++) {
			for (let p = 0; p < alternates.length; p++) {
				if (all_locale[i] == alternates[p].language) {
					sortedAlternates.push(alternates[p]);
					break;
				}
			}
		}
		
		return sortedAlternates;
	}

	
	return alternates;
};

export { getAlternateLanguagesUrls };
