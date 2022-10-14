import { PaginationArrType } from "./paginationHelperTypes.js";

// add pages by number (from [s] to [f])
const add = (s: number, f: number, paginationArr: PaginationArrType) => {
	for (let i = s; i < f; i++) {
		paginationArr.push(i);
	}
	return paginationArr;
};

// add last page with separator
const last = (x: number, paginationArr: PaginationArrType) => {
	paginationArr.push("...");
	paginationArr.push(x);
	return paginationArr;
};

// add first page with separator
const first = (paginationArr: PaginationArrType) => {
	paginationArr.push(1);
	paginationArr.push("...");
	return paginationArr;
};

const start = (x: number, y: number, z: number) => {
	let paginationArr: PaginationArrType = [];
	if (x < z * 2 + 6) {
		paginationArr = add(1, x + 1, paginationArr);
	} else if (y < z * 2 + 1) {
		paginationArr = add(1, z * 2 + 4, paginationArr);
		paginationArr = last(x, paginationArr);
	} else if (y > x - z * 2) {
		paginationArr = first(paginationArr);
		paginationArr = add(x - z * 2 - 2, x + 1, paginationArr);
	} else {
		paginationArr = first(paginationArr);
		paginationArr = add(y - z, y + z + 1, paginationArr);
		paginationArr = last(x, paginationArr);
	}
	return paginationArr;
};

const createPaginationArr = (
	totalPagesCount: number,
	currentPage: number,
	pagesBeforeAndAfterCurrent: number
) => {
	return start(totalPagesCount, currentPage, pagesBeforeAndAfterCurrent);
};

export { createPaginationArr };
