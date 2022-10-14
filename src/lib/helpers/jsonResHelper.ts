const errorObj = (generalMsg: string, error: string | Record<string | number, any>) => {
	if (typeof generalMsg !== "string") generalMsg = "Something went wrong!";

	let obj = Object.create(null);
	obj.success = false;
	obj.msg = generalMsg;
	if (typeof error === "string") {
		obj.errors = [
			{
				msg: error,
			},
		];
	} else {
		obj.errors = error;
	}

	return obj;
};

const successObj = (generalMsg: string, resObj?: Record<string | number, any>) => {
	if (typeof generalMsg !== "string") generalMsg = "Something went wrong!";

	let obj = Object.create(null);
	obj.success = true;
	obj.msg = generalMsg;
	if (resObj) {
		obj.res = resObj;
	}

	return obj;
};

export { errorObj, successObj };
