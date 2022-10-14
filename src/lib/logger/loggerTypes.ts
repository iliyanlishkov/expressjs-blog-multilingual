export interface LoggerObjExtraInfoType {
	//object type is just an empty object by default. Therefore it isn't possible to use a string type to index {} like a[b]. Now we are telling the compiler the obj argument will be a cpair of string or number as a key and an object as a value or undefined.
	// an alternative way is to write this: "<T extends object, U extends keyof T>(b: U) => (a: T) => a[b];"
	[key: string | number]:
		| LoggerObjExtraInfoType
		| boolean
		| string
		| number
		| undefined
		| null;
}

export interface Logger {
	extraInfo?: LoggerObjExtraInfoType;
	[key: string | number]:
		| LoggerObjExtraInfoType
		| boolean
		| string
		| number
		| undefined;
}
