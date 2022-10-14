import { slashNotation, getNestedObject } from "./utils/utils.js";
import { requireDir } from "../requireDir/requireDir.js"; // dependency
import { fallback_locale, translationsDir } from "../../config/locale.js";

import {
	ObjWithKeyAndObjOrUndefinedValue,
	ObjWithKeyAndStringOrNumberAsValue,
} from "./localeTypes";

const dir_langs: ObjWithKeyAndObjOrUndefinedValue = await requireDir(
	translationsDir || "./dist/translations/lang"
);

const getForLocale = (path: string): string | undefined => {
	// returns undfined if not found
	if (!path || typeof path !== "string" || path.length == 0 || path == "/") {
		throw new Error(
			"'path' is undefined. You need to define a path in string format like 'en/routes.homepage' for example with dot notation for in file key and slash entering in folder."
		);
	}

	let dirPathsArr = path.split("/");
	let filePathsArr = dirPathsArr[dirPathsArr.length - 1].split(".");
	let finalPathArr = [];

	for (let i = 0; i < dirPathsArr.length - 1; i++) {
		finalPathArr.push(dirPathsArr[i]);
	}

	for (let i = 0; i < filePathsArr.length; i++) {
		finalPathArr.push(filePathsArr[i]);
		if (i == 0) {
			finalPathArr.push("default");
		}
	}

	for (let lang in dir_langs) {
		if (finalPathArr[0] == lang) {
			let parseDirLang = slashNotation(lang, dir_langs);
			let nestedObj = getNestedObject(
				parseDirLang,
				finalPathArr.slice(1)
			);

			if (typeof nestedObj !== "string") {
				nestedObj = JSON.stringify(nestedObj) as string;
			}
			return nestedObj;
		}
	}

	return undefined;
};

const getTranslationForLocale = (
	path: string,
	paramsArray?: ObjWithKeyAndStringOrNumberAsValue
): string => {
	let _translationString = getForLocale(path);

	if (_translationString !== "" && !_translationString) {
		// in case translation is not found for the selected locale check if it exists for the fallback locale
		if (path.split("/")[0] != fallback_locale) {
			_translationString = getForLocale(
				path.replace(/^[^/]+/, fallback_locale)
			);
		}
	}

	if (
		typeof _translationString === "string" ||
		typeof _translationString === "number"
	) {
		return getTranslationWithReplacedParams(
			_translationString,
			paramsArray
		);
	} else if (typeof _translationString === "undefined") {
		return "";
	} else {
		return _translationString;
	}
};

const getTranslationWithReplacedParams = (
	_translationString: string,
	paramsArray?: ObjWithKeyAndStringOrNumberAsValue
): string => {
	if (!_translationString) {
		return "";
	} // return empty string if no translation was found

	if (paramsArray) {
		let keys: string[] = Object.keys(paramsArray);

		for (let i = 0; i < keys.length; i++) {
			_translationString = _translationString.replaceAll(
				":" + keys[i],
				paramsArray[keys[i]].toString()
			);
		}
	}

	return _translationString;
};

export {
	getForLocale,
	getTranslationWithReplacedParams,
	getTranslationForLocale,
};
