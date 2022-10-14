export interface ModelGlobals {
	DB_table_name?: string;
	recordFetchedBy: {
		column: string;
		value: string | number | null;
	};
	queryConditions: {
		where: Array<[string, string, string | number]>; // array with arrays in it, each with 3 params (column, condition, value)
		orWhere: Array<[string, string, string | number]>; // array with arrays in it, each with 3 params (column, condition, value)
		orderBy: Array<[string, "asc" | "desc"]>; // array with arrays in it, each with 2 params (column, order)
		paginate: {
			isSet: boolean; // if changed to true, a pagination will be added to the query with OFFSET and FETCH FIRST * ROWS ONLY
			limit: number; // default value if isSet = true or the passed information is not valid
			offset: number; // default value if isSet = true or the passed information is not valid
		};
	};
	req?: any;
	res?: any;
}

export interface LooseObject {
	// bject to which we could assign dynamically any variables
	[key: string | number]: any;
}

export interface ModelInterface {
	
	modelGlobals: ModelGlobals;

	[key: string | number]: any; //so we could define as many variables we want to be able to update() the fetched record directly;

	findById(id: number): Promise<null | ModelInterface>;
	update(): Promise<null | LooseObject[]>;
	save(): Promise<null | LooseObject[]>;
	delete(): Promise<null | LooseObject[]>;

	where(
		column: string,
		condition: string,
		value: string | number
	): ModelInterface;

	orWhere(
		column: string,
		condition: string,
		value: string | number
	): ModelInterface;

	orderBy(column: string, order: "desc" | "asc"): ModelInterface;

	paginate(limit: number): ModelInterface;

	first(selectColumnsArr?: string[]): Promise<null | LooseObject>;

	get(
		selectColumnsArr?: string[],
		fetchFirst?: boolean
	): Promise<null | LooseObject[]>;

	getRaw(query: string): Promise<null | LooseObject[]>;
}
