import { queryDb } from "../../lib/db/postgresql/pool/pool.js";
import { setLoggerExtraInfo } from "../../lib/logger/logger.js";

import { Request, Response, NextFunction } from "express";

import { LooseObject, ModelGlobals, ModelInterface } from "./MainTypes.js";

const setCoumnsAndValuesHelper = (self: LooseObject) => {
	let keys = Object.keys(self);
	let columns: string[] = [];
	let values = [];

	for (let i = 0; i < keys.length; i++) {
		
		if (
			keys[i] != "modelGlobals" &&
			keys[i] != "id" &&
			keys[i] != "created_at" &&
			keys[i] != "updated_at" 
			// self[keys[i]] != null
		) {
			// TODO add method or a way to edit timestamps
			columns.push(keys[i]);
			//if type is string wrap it in quotes
			if (
				typeof self[keys[i]] === "string" ||
				typeof self[keys[i]] === "symbol" ||
				typeof self[keys[i]] === "undefined"
			) {
				values.push(`'` + self[keys[i]] + `'`);
			} else if (
				typeof self[keys[i]] === "number" ||
				typeof self[keys[i]] === "bigint" ||
				typeof self[keys[i]] === "boolean"
			) {
				values.push(self[keys[i]]);
			} else if(self[keys[i]] == null) {
				values.push("NULL");
			} else if (typeof self[keys[i]] === "object") {
				values.push(`ARRAY ` + JSON.stringify(self[keys[i]]));
			} else {
				// in case type is function
				values.push("");
			}
		}
	}

	return {
		columns: columns.join(","),
		values: values,
	};
};

const buildQueryHelper = (self: LooseObject, selectColumnsArr?: string[]) => {
	// in case we oly need to return only particular columns instead of all
	let selectColumns = "*";
	if (selectColumnsArr) {
		if (Array.isArray(selectColumnsArr)) {
			let selectColumnsString = "";
			for (let i = 0; i < selectColumnsArr.length; i++) {
				if (typeof selectColumnsArr[i] !== "string") {
					selectColumnsString = selectColumns;
					throw new Error(
						`You need to pass an array with strings to the first() or get() query models! If you don't pass nothing, a wildcard * will be used for the query! Currently you have passed parameter: '${JSON.stringify(
							selectColumnsArr[i]
						)}', with typeof: '${typeof selectColumnsArr[
							i
						]}' (typeof 'string' expected)`
					);
				}

				selectColumnsString += selectColumnsArr[i];
				if (i < selectColumnsArr.length - 1) {
					selectColumnsString += `,`;
				}
			}
			selectColumns = selectColumnsString;
		} else {
			throw new Error(
				`You need to pass an array with strings to the first() or get() query models! If you don't pass nothing, a wildcard * will be used for the query! Currently you have passed parameter with typeof '${typeof selectColumnsArr}'.`
			);
		}
	}

	// building the WHERE query
	let whereQry = ``;
	for (let i = 0; i < self.modelGlobals.queryConditions.where.length; i++) {
		whereQry += self.modelGlobals.queryConditions.where[i][0];
		whereQry += ` ${self.modelGlobals.queryConditions.where[i][1]} `;
		whereQry += `'${self.modelGlobals.queryConditions.where[i][2]}'`;
		if (i < self.modelGlobals.queryConditions.where.length - 1) {
			whereQry += " AND ";
		}
	}

	// building the OR query
	let orWhereQry = ``;
	for (let i = 0; i < self.modelGlobals.queryConditions.orWhere.length; i++) {
		orWhereQry += self.modelGlobals.queryConditions.orWhere[i][0];
		orWhereQry += ` ${self.modelGlobals.queryConditions.orWhere[i][1]} `;
		orWhereQry += `'${self.modelGlobals.queryConditions.orWhere[i][2]}'`;
		if (i < self.modelGlobals.queryConditions.orWhere.length - 1) {
			orWhereQry += " AND ";
		}
	}

	// building the orderBy query
	let orderByQry = ``;
	for (let i = 0; i < self.modelGlobals.queryConditions.orderBy.length; i++) {
		orderByQry += self.modelGlobals.queryConditions.orderBy[i][0];
		orderByQry += ` ${self.modelGlobals.queryConditions.orderBy[
			i
		][1].toUpperCase()}`;
		if (i < self.modelGlobals.queryConditions.orderBy.length - 1) {
			orderByQry += ", ";
		}
	}

	return {
		selectColumns: selectColumns,
		whereQry: whereQry,
		orWhereQry: orWhereQry,
		orderByQry: orderByQry,
	};
};

const tableNameExists = (name: any, functionName: string) => {
	if (typeof name !== "string" || name === "") {
		throw new Error(
			`You need to pass a table_name as a string in the super(table_name) from your Model constructor! The error was caused from calling ${functionName}`
		);
	}
};

// class Model {
class Model implements ModelInterface {
	modelGlobals!: ModelGlobals;

	// constructor(DB_table_name) {
	constructor(DB_table_name?: string, req?: Request, res?: Response) {
		// we need to pass the req and res here only if we are using pagination
		this.modelGlobals = {
			DB_table_name: DB_table_name,
			recordFetchedBy: {
				column: `id`,
				value: null,
			},
			queryConditions: {
				where: [], // array with arrays in it, each with 3 params (column, condition, value)
				orWhere: [], // array with arrays in it, each with 3 params (column, condition, value)
				orderBy: [], // array with arrays in it, each with 2 params (column, order)
				paginate: {
					isSet: false, // if changed to true, a pagination will be added to the query with OFFSET and FETCH FIRST * ROWS ONLY
					limit: 10, // default value if isSet = true or the passed information is not valid
					offset: 0, // default value if isSet = true or the passed information is not valid
				},
			},
			req: req,
			res: res,
		};
	}

	/* FIXED QUERY */
	async findById(id: number): Promise<ModelInterface | null> {

		tableNameExists(this.modelGlobals.DB_table_name, "findById()");
		// get only a single row (not multiple)

		let self: ModelInterface = this;
		self.modelGlobals.recordFetchedBy.column = "id";
		self.modelGlobals.recordFetchedBy.value = id;

		let queryRes: null | LooseObject = null;
		let query = `
			SELECT * 
			FROM ${this.modelGlobals.DB_table_name} 
			WHERE id='${id}' 
			FETCH FIRST 1 ROWS ONLY;
		`;

		try {
			queryRes = await queryDb(query);
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "findById()",
				query: JSON.stringify(query),
			});
		}

		// this is done so we could update directly the record with the update() function;
		if (queryRes) {
			let keys = Object.keys(queryRes[0]);
			for (let i = 0; i < keys.length; i++) {
				self[keys[i]] = queryRes[0][keys[i]];
			}
		} else {
			return null;
		}

		return self;
	}


	// the update function is looping through the Class properties, skipping updated_at and created_at and modelGlobals and is updating the record
	async update() {
		tableNameExists(this.modelGlobals.DB_table_name, "update()");

		// updates only a single row (not multiple)
		let self: ModelInterface = this;
		let { columns, values } = setCoumnsAndValuesHelper(self);

		let query = `WITH singleRow AS (
				SELECT ${self.modelGlobals.recordFetchedBy.column} 
				FROM ${self.modelGlobals.DB_table_name} 
				WHERE ${self.modelGlobals.recordFetchedBy.column} = '${self.modelGlobals.recordFetchedBy.value}' 
				FETCH FIRST 1 ROWS ONLY
			)
			UPDATE ${self.modelGlobals.DB_table_name} AS main
			SET (${columns}) = (${values}) 
			FROM singleRow 
			WHERE main.${self.modelGlobals.recordFetchedBy.column} = singleRow.${self.modelGlobals.recordFetchedBy.column} 
			RETURNING main.*;
		`;

		try {
			return await queryDb(query);
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "update()",
				query: JSON.stringify(query),
			});
		}
	}

	async save() {
		tableNameExists(this.modelGlobals.DB_table_name, "save()");

		// saves only a single row (not multiple)
		let self: ModelInterface = this;

		let { columns, values } = setCoumnsAndValuesHelper(self);

		let query = `INSERT INTO ${self.modelGlobals.DB_table_name} 
			(${columns}) VALUES (${values}) 
			FETCH FIRST 1 ROWS ONLY;
		`;

		try {
			return await queryDb(query);
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "save()",
				query: JSON.stringify(query),
			});
		}
	}

	async delete() {
		tableNameExists(this.modelGlobals.DB_table_name, "delete()");

		let self: ModelInterface = this;
		// deletes only a single row (not multiple)
		let query = `
			WITH singleRow AS (
				SELECT ${self.modelGlobals.recordFetchedBy.column} 
				FROM ${self.modelGlobals.DB_table_name} 
				WHERE ${self.modelGlobals.recordFetchedBy.column} = '${self.modelGlobals.recordFetchedBy.value}' 
				FETCH FIRST 1 ROWS ONLY
			)
			DELETE FROM ${self.modelGlobals.DB_table_name} as main
			USING singleRow 
			WHERE main.${self.modelGlobals.recordFetchedBy.column} = singleRow.${self.modelGlobals.recordFetchedBy.column} 
			RETURNING main.*;
		`;

		try {
			return await queryDb(query);
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "delete()",
				query: JSON.stringify(query),
			});
		}
	}

	/* CONDITIONAL QUERY */
	where(column: string, condition: string, value: string | number) {
		let self: ModelInterface = this;
		if (
			typeof column !== "string" ||
			typeof condition !== "string" ||
			(typeof value !== "string" && typeof value !== "number")
		)
			throw new Error(
				`Wrong type of params passed to the function where()! First param is with typeof '${typeof column}' (typeof 'string' expected); second param is with typeof '${typeof condition}' (typeof 'string' is expected); third is with typeof '${typeof value}' (type of 'string' or 'number' is expected)`
			);
		self.modelGlobals.queryConditions.where.push([
			column,
			condition,
			value,
		]);
		return self;
	}

	orWhere(column: string, condition: string, value: string | number) {
		let self: ModelInterface = this;
		if (
			typeof column !== "string" ||
			typeof condition !== "string" ||
			(typeof value !== "string" && typeof value !== "number")
		)
			throw new Error(
				`Wrong type of params passed to the function orWhere()! First param is with typeof '${typeof column}' (typeof 'string' expected); second param is with typeof '${typeof condition}' (typeof 'string' is expected); third is with typeof '${typeof value}' (type of 'string' or 'number' is expected)`
			);
		self.modelGlobals.queryConditions.orWhere.push([
			column,
			condition,
			value,
		]);
		return self;
	}

	orderBy(column: string, order: "desc" | "asc") {
		let self: ModelInterface = this;
		if (typeof column !== "string" || typeof order !== "string")
			throw new Error(
				`Wrong type of params passed to the function orderBy()! First param is with typeof '${typeof column}' (typeof 'string' expected); second param is with typeof '${typeof order}' (typeof 'string' is expected)`
			);
		self.modelGlobals.queryConditions.orderBy.push([column, order]);
		return self;
	}

	paginate(limit: number) {
		let self: ModelInterface = this;

		if (!self.modelGlobals.req) {
			throw new Error(
				"You need to pass the req object as first element to the new Model(req,res) function!"
			);
		}
		if (!self.modelGlobals.res) {
			throw new Error(
				"You need to pass the res object as second element to the new Model(req,res) function!"
			);
		}

		if (!limit) limit = self.modelGlobals.req.query.limit;
		limit = Number(limit);

		let page = Number(self.modelGlobals.req.query.page);

		self.modelGlobals.queryConditions.paginate.isSet = true;

		if (limit && Number.isInteger(limit) && limit > 0) {
			self.modelGlobals.queryConditions.paginate.limit = limit;
		}

		if (page && Number.isInteger(page) && page > 1) {
			for (let i = 1; i < page; i++) {
				self.modelGlobals.queryConditions.paginate.offset +=
					self.modelGlobals.queryConditions.paginate.limit;
			}
		} else {
			page = 1;
		}

		self.modelGlobals.res.locals.pagination = {
			curPage: page,
			limit: self.modelGlobals.queryConditions.paginate.limit,
			path: self.modelGlobals.req.path,
			queryStr: self.modelGlobals.req.query,
		};
		return self;
	}

	async first(selectColumnsArr?: string[]) {
		tableNameExists(this.modelGlobals.DB_table_name, "first()");
		
		try {
			let res = await this.get(selectColumnsArr, true);
			if (res && res.length > 0) {
				return res[0];
			}

			return null;
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "first()",
				selectColumnsArr: JSON.stringify(selectColumnsArr),
			});
		}
	}
	

	async get(selectColumnsArr?: string[], fetchFirst?: boolean) {
		tableNameExists(this.modelGlobals.DB_table_name, "get()");

		let self = this;
		let { selectColumns, whereQry, orWhereQry, orderByQry } =
			buildQueryHelper(self, selectColumnsArr);

		// Building the main query. In order to have "OR" there must be a "WHERE" defined first
		let query =
			`` +
			(this.modelGlobals.queryConditions.paginate.isSet
				? `SELECT
					(SELECT COUNT(*) 
					FROM ${this.modelGlobals.DB_table_name}` +
				  (whereQry.length > 0 ? ` WHERE (${whereQry})` : ``) +
				  (whereQry.length > 0 && orWhereQry.length > 0
						? ` OR (${orWhereQry})`
						: ``) +
				  `) as count, 
					(SELECT json_agg(t.*) FROM (`
				: ``) +
			`SELECT ${selectColumns} 
			FROM ${this.modelGlobals.DB_table_name}` +
			(whereQry.length > 0 ? ` WHERE (${whereQry})` : ``) +
			(whereQry.length > 0 && orWhereQry.length > 0
				? ` OR (${orWhereQry})`
				: ``) +
			(orderByQry.length > 0 ? ` ORDER BY ${orderByQry}` : ``) +
			(this.modelGlobals.queryConditions.paginate.isSet
				? ` OFFSET ${this.modelGlobals.queryConditions.paginate.offset}
				FETCH FIRST ${this.modelGlobals.queryConditions.paginate.limit} ROWS ONLY
				) AS t) AS rows`
				: fetchFirst
				? ` FETCH FIRST 1 ROWS ONLY`
				: ``) +
			`;`;
		try {
			let res = await queryDb(query);
			if (res && this.modelGlobals.queryConditions.paginate.isSet) {
				this.modelGlobals.res.locals.pagination.totalCnt = res[0].count;
				res = res[0].rows;
			}

			return res;
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "get()",
				query: JSON.stringify(query),
			});
		}
	}

	async getRaw(query: string) {
		if (typeof query !== "string") {
			throw new Error(
				"You need to pass a valid string with the SELECT QUERY to the getRaw() function!"
			);
		}

		try {
			return await queryDb(query);
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "getRaw()",
				query: JSON.stringify(query),
			});
		}
	}
}

export { Model };
