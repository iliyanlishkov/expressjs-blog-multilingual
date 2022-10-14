export interface RandomObj {
	// this means that in case 'args' contains an object, then the object could have keys of type string or number and it's value must be a string or number as well.
	[key: string | number]: string | number;
}
