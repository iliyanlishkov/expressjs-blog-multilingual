import { ObjWithKeyAndObjOrUndefinedValue } from "./utilsTypes.js";

const slashNotation = (
	locale: string,
	dirObj: ObjWithKeyAndObjOrUndefinedValue
): ObjWithKeyAndObjOrUndefinedValue => {
	return locale.split("/").reduce((o, i) => {
		let fileObj = o[i];
		if (typeof fileObj === "undefined") {
			throw new Error(`The file "${locale}" was not found!`);
		}
		return fileObj;
	}, dirObj);
};

const getNestedObject = (
	dirObj: ObjWithKeyAndObjOrUndefinedValue,
	pathSplitArr: string[]
): ObjWithKeyAndObjOrUndefinedValue | string | undefined => {
	// returns undefined if not existing

	return pathSplitArr.reduce(
		(dirObj, level) =>
			dirObj && <ObjWithKeyAndObjOrUndefinedValue>dirObj[level],
		dirObj
	);
};

export { slashNotation, getNestedObject };
