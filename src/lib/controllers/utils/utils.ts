import { ObjWithKeyAndObjOrUndefinedValue } from "./utilsTypes.js";

const namespace = (name: string) => {
	return name.replace(/(\b|\.)\w/g, (l) => l.toUpperCase()).replace(".", "");
};

const slashNotation = (
	path: string,
	object: ObjWithKeyAndObjOrUndefinedValue
) => {
	return path.split("/").reduce((o, i) => {
		let fileObj = o[i];
		if (typeof fileObj === "undefined") {
			throw new Error(`The file "${path}" was not found!`);
		}
		return fileObj;
	}, object);
};

export { namespace, slashNotation };
