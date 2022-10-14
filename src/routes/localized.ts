export default [
	{
		method: "get", // method
		path: "routes.home", // path in src/translations/:lang/ folder from where the pattern will be get
		controller: "HomeController@index", // controller name and method
		name: "_get_home_.index", // name of the route which will be prefixed with language. Final name will be: en_get_home_.index
	},
	{
		method: "get", // method
		path: "routes.profile", // path in src/translations/:lang/ folder from where the pattern will be get
		controller: "ProfileController@index", // controller name and method
		name: "_get_profile_.index", // name of the route which will be prefixed with language. Final name will be: en_get_home_.index
	},
	{
		method: "get",
		path: "routes.blogArchive",
		controller: "BlogController@archive",
		name: "_get_blog_.archive",
	},
	{
		method: "get",
		path: "routes.singleBlogPost",
		controller: "BlogController@singleBlogPost",
		name: "_get_blog_.singleBlogPost",
	},
];
