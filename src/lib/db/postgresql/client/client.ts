import pg from "pg";
import { config } from "../config/config.js";
import { ConfObj } from "./clientTypes.js";

const queryDb = async (
	queryStr: string,
	paramsArr?: (string | number)[],
	configObj?: ConfObj,
	callback?: Function
) => {
	let client = new pg.Client(config(configObj));

	try {
		await client.connect();
	} catch (err: any) {
		throw new Error(err);
	}

	let res = null;
	try {
		res = await client.query(queryStr, ...[paramsArr], callback);
	} catch (err: any) {
		throw new Error(err);
	}

	try {
		await client.end();
	} catch (err: any) {
		throw new Error(err);
	}

	if (res === null) {
		return res;
	}

	return res.rows;
};

export { queryDb };
