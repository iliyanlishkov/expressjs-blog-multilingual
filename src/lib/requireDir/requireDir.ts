import { stat, readdir } from "fs/promises";
import { join, resolve } from "path";

import {
	ObjWithKeyAndObjOrBooleanValue,
	ObjWithKeyAndObjOrUndefinedValue,
} from "./requreDirTypes.js";

const defaultOptions: ObjWithKeyAndObjOrBooleanValue = {
	extensions: <string[]>["js", "json", "coffee"],
	recurse: <boolean>true,
	rename: (name: string): string => {
		return name;
	},
	visit: (
		obj: ObjWithKeyAndObjOrUndefinedValue
	): ObjWithKeyAndObjOrUndefinedValue => {
		return obj;
	},
};

const checkFileInclusion = (
	path: string,
	filename: string,
	options: ObjWithKeyAndObjOrBooleanValue
) => {
	return (
		// verify file has valid extension
		Array.isArray(options.extensions) &&
		new RegExp("\\.(" + options.extensions.join("|") + ")$", "i").test(
			filename
		) &&
		// if options.include is a RegExp, evaluate it and make sure the path passes
		!(
			options.include &&
			options.include instanceof RegExp &&
			!options.include.test(path)
		) &&
		// if options.include is a function, evaluate it and make sure the path passes
		!(
			options.include &&
			typeof options.include === "function" &&
			!options.include(path, filename)
		) &&
		// if options.exclude is a RegExp, evaluate it and make sure the path doesn't pass
		!(
			options.exclude &&
			options.exclude instanceof RegExp &&
			options.exclude.test(path)
		) &&
		// if options.exclude is a function, evaluate it and make sure the path doesn't pass
		!(
			options.exclude &&
			typeof options.exclude === "function" &&
			options.exclude(path, filename)
		)
	);
};

const requireDir = async (
	path: string,
	options?: ObjWithKeyAndObjOrBooleanValue
): Promise<ObjWithKeyAndObjOrUndefinedValue> => {
	let retval: ObjWithKeyAndObjOrUndefinedValue = Object.create(null);

	// default options
	options = options || {};
	for (let prop in defaultOptions) {
		if (typeof options[prop] === "undefined") {
			options[prop] = defaultOptions[prop];
		}
	}

	if (!path) {
		throw new Error("Path is required!");
	} else {
		path = resolve(path);
	}

	try {
		let allFiles = await readdir(path);

		for (let fileName of allFiles) {
			let joined = join(path, fileName),
				files,
				key,
				obj;
			try {
				let fileStat = await stat(joined);

				if (fileStat.isDirectory() && options.recurse) {
					// this node is a directory; recurse
					files = await requireDir(joined, options);
					// exclude empty directories
					if (
						Object.keys(files).length &&
						typeof options.rename == "function"
					) {
						retval[options.rename(fileName, joined, fileName)] =
							files;
					}
				} else {
					if (checkFileInclusion(joined, fileName, options)) {
						// hash node key shouldn't include file extension
						key = fileName.substring(0, fileName.lastIndexOf("."));

						try {
							obj = await import(joined);
							if (
								typeof options.rename == "function" &&
								typeof options.visit == "function"
							) {
								retval[options.rename(key, joined, fileName)] =
									options.visit(obj, joined, fileName) || obj;
							}
						} catch (err: any) {
							throw new Error(err);
						}
					}
				}
			} catch (err: any) {
				throw new Error(err);
			}
		}
	} catch (err: any) {
		throw new Error(err);
	}
	return retval;
};

export { requireDir };
