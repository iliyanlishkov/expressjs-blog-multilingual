const toggleAlertsMsg = (show, status, msg) => {
	if (typeof show !== "boolean") throw new Error("show is not a boolean");
	if (typeof status !== "string") throw new Error("status is undefined");
	if (typeof msg === "undefined") throw new Error("msg is undefined");

	document.querySelectorAll("#alert-messages .alert").forEach(msgContainer => {

		if (show && msgContainer.className.indexOf(status) > -1) {
			if (typeof msg === "string") {
				msgContainer.innerHTML = msg;
			} else if (typeof msg === "object") {
				if (msg.errors && msg.errors.length > 0 && msg.errors[0].msg) {
					msgContainer.innerHTML = msg.errors[0].msg;
				} else {
					msgContainer.innerHTML = "The filled information is incorrect!";
				};
			};
			msgContainer.classList.remove("hidden");
		} else {
			msgContainer.classList.add("hidden");
		};
	});
};

const defaultCatchErrorHandler = (error) => {
	let err = {
		errors: []
	};
	if (error.errors) {
		err.errors = error.errors;
	} else {
		err = { errors: [{ msg: "Unhandled error! " + JSON.stringify(error) }] }
	};
	toggleAlertsMsg(true, "error", err);
	console.error("Unhandled Error! ", error);
};