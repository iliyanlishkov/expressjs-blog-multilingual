// import { setNamedRoutes, registerRouteGroups } from "../lib/route/route.js";

// const routesGroup = setNamedRoutes({
// 	method: "get",
// 	path: "/",
// 	controller: "Admin/AdminController@index",
// 	name: "admin.index",
// });

// const routes = registerRouteGroups(routesGroup);

// export default routes;

const prefix = "/admin";

export default [
	{
		method: "get",
		path: `${prefix}`,
		controller: "Admin/AdminController@index",
		name: "admin.index",
	},
];
