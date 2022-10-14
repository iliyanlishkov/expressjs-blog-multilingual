import { queryDb } from "../../lib/db/postgresql/pool/pool.js";
import { Model } from "../main/Main.js";
import { setLoggerExtraInfo } from "../../lib/logger/logger.js";

import { Request, Response } from "express";

import { LooseObject } from "./UserTypes.js";
import { ModelInterface } from "../main/MainTypes.js";

class User extends Model {
	constructor(req?: Request, res?: Response /*column, value*/) {
		super("users", req, res);

		// this.modelGlobals.DB_table_name = "users"; /// the name of the table in the DB
		// if (column) this.modelGlobals.recordFetchedBy.column = column;
		// if (value) this.modelGlobals.recordFetchedBy.value = value;
	}

	async findUserByEmail(email: string): Promise<ModelInterface | null> {
		// some commonly used query

		let self: ModelInterface = this;
		self.modelGlobals.recordFetchedBy.column = "email";
		self.modelGlobals.recordFetchedBy.value = email;

		let queryRes: null | LooseObject = null;
		let query = `
			SELECT * 
			FROM ${this.modelGlobals.DB_table_name} 
			WHERE ${self.modelGlobals.recordFetchedBy.column} = '${self.modelGlobals.recordFetchedBy.value}' 
			FETCH FIRST 1 ROWS ONLY
		;`;

		try {
			queryRes = await queryDb(query);
		} catch (err: any) {
			throw setLoggerExtraInfo(err, {
				functionName: "findUserByEmail()",
				query: JSON.stringify(query),
			});
		}

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
}

export { User };
