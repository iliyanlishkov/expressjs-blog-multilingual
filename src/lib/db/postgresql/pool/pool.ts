import pg from "pg";
import { config } from "../config/config.js";

import { ConfObj, LooseObject } from "./poolTypes.js";


if (!global.db) {
	global.db = {
		pool: null,
	};
}

const setPool = (configObj: ConfObj | undefined): void => {
	if (global.db.pool === null) {
		console.log("No pool available, creating new pool.");
		
		let pool = new pg.Pool(config(configObj));	
		

		// the pool will emit an error on behalf of any idle clients
		// it contains if a backend error or network partition happens
		pool.on("error", (err, client) => {
			console.error("Unexpected error on idle client", err);
			pool.end(() => {
				global.db.pool = null;
				console.log("pool has ended");
			});
			// process.exit(-1);
		});

		global.db.pool = pool;
	}
};

const queryDb = async (
	queryStr: string,
	paramsArr?: (string | number)[],
	configObj?: ConfObj,
	callback?: Function
) => {
	setPool(configObj);

	let res = null;

	// console.log("totalCount:  ", global.db.pool.totalCount);
	// console.log("idleCount:  ", global.db.pool.idleCount);
	// console.log("waitingCount:  ", global.db.pool.waitingCount);

	try {
		res = await global.db.pool.query(queryStr, paramsArr, callback);
	} catch (err: any) {
		// console.log("There was a problem with the DB query! ", err);
		// throw new Error("There was a problem with the DB query!");
		throw new Error(err);
	}

	if (res === null || res.rows.length == 0) {
		return null;
	}
	
	return res.rows as LooseObject[];
};

export { queryDb };
