# Express JS multilingual blog with authentication and authorization (Laravel like app)
As I have been using Laravel since 2015, I really like how everything is handled there, so I decided to make a similar mini framework but written with Express JS and TypeScript and minimal count of libraries included (only libraries like nodemailer for the auth email verification process, express-validator for the forms etc).

**This project includes:**

- user authentication:
	- Email and password login - using JWT (implemented only by using the library "jsonwebtoken" without any Passport JS stuff). This includes registration, login, forgot password, resend email verification link forms.
	- Google login - using Passport JS
	- Facebook login - using Passport JS
- user authorization - user roles with different permissions
- localized in a very interesting way which I believe you will find useful and is what I'm kinda proud of. This includes helpers for strings translating for the different languages and much more.
- DB: Redis and PostgreSQL - I have created my own ORM to query it which is very similar to Laravel's Eloquent
- EJS templating (including email templates) - there are main layouts which could be extended by sublayouts and custom parameters. 
- blog with localized pagination and head attributes
- SEO designed - each page could have meta tags for alternate urls for example for the different languages; no indexing attribute for the pages we don't want to be indexed etc. 
- Controllers just like in Laravel where you can pass middlewares only for the desired functions (something else that I am proud of because I had to write my own library for that purpose) or for all functions in the controller file.
- custom logger

## Coming next:
Some things that I have already implemented in Laravel will be written for Express JS as well.
- Skrill, PayPal, Stripe, MyPOS, Neteller banks implementation
- React JS admin panel to manage blog posts, products and users
- Translating interface with roles, so you can hire a translator and provide him with web interface to make the translations, without having to edit the files manually on the server
- Affiliate program with banners and tracking interface

# Documentation
Don't forget that this is just the base for a bigger project. There is a lot more that needs to be done but this will turn into a customized project if I continue further and each person might want to customize it in a different way, so I have stopped at this stage by covering only the basic features on a basic level.

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Directory Structure](#directory-structure)
5. [Frontend](#frontend)
6. [Routing](#routing)
7. [URL generation (named routes)](#url-generation-named-routes)
8. [ORM](#orm)
9. [Controllers](#controllers)
10. [Middlewares](#middlewares)
11. [Localization](#localization)
12. [Validations](#validations)
13. [Mail](#mail)
14. [Helpers](#helpers)
15. [Logging And Error Handling](#logging-and-error-handling)



## Requirements
1. PostgreSQL
2. Redis
3. Node JS
## Installation
1. Clone the repository
```
git clone https://github.com/iliyanlishkov/expressjs-blog-multilingual.git
```
2. Install the packages
```
npm install
```
3. Create and configure your Postgre DB (you will find it exported in the project folder as `db.sql`)
```
// log into postgre
sudo -u postgres psql

// create database with name app
postgres=# create database app;

// import the db
psql -d app -f db.sql
```
4. Make a copy of env.example file with name .env and configure it
5. Run the app:
```
npm run dev:nodemon
```
5. Open http://localhost:3000/ and let the customizing begin!

## Configuration
All of the configuration files for the framework are stored in the [The `config` Directory](#the-config-directory). 
### Accessing ENV Values
In a fresh installation, the root directory of your application will contain a `.env.example` file that defines many common environment variables. After the installation process, you have to copy this file in the root directory and rename it to `.env`

Framework's default `.env` file contains some common configuration values that may differ based on whether your application is running locally or on a production web server. These values are then retrieved from various configuration files within the config directory or directly into the other files. 

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

#### #Retrieving Environment Configuration
All of the variables listed in the `.env` file could be retrieved by using the global `process.env` object which is created by the [dotenv](https://www.npmjs.com/package/dotenv) package.
```
process.env.APP_PORT
```

### Accessing CONFIG Values
All the config values are directly imported in the files where they will be used.
```js
import { mailServerConfig } from "../config/mail/mailServerConfig.js";
```

### TypeScript Config
The `tsconfig.json` is located in [The Root Directory](#the-root-directory). The presence of a `tsconfig.json` file in a directory indicates that the directory is the root of a TypeScript project. The `tsconfig.json` file specifies the root files and the compiler options required to compile the project. For more information and how to use it, follow this [link](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

### Scripts Config
As TypeScript needs to compile, so you could see the changes on the web, I have created a quick scripts in the `package.json` file, so each time you hit CTRL+S, nodemon is compiling the TS and resetting the server on port 3000 by killing all processes on this port before it starts the server again. You can change the port in the `package.json` file in case you want to run the project on a different port. Thanks to this command, each time you save your project all changes will apply automatically on the web which really makes your life easier. Nodemon will watch for changes in [The App Directory](#the-app-directory), [tsconfig.json](#typescript-config) file and the [.env](#accessing-env-values) file. It also pre loads the .env file so it could be accessed outside functions in imported files as imports are "hoisted" (all dependencies are evaluated before starting the execution of the importing module).

## Directory Structure
The default application structure is intended to provide a great starting point for both large and small applications. But you are free to organize your application however you like.

#### [The Root Directory](#the-root-directory-1)

- [The `dist` Directory](#the-dist-directory)
- [The `public` Directory](#the-public-directory)
- [The `src` Directory](#the-src-directory)
- [The `storage` Directory](#the-storage-directory)

#### [The App Directory](#the-app-directory-1)
- [The `config` Directory](#the-config-directory)
- [The `controllers` Directory](#the-controllers-directory)
- [The `lib` Directory](#the-lib-directory)
- [The `mail` Directory](#the-mail-directory)
- [The `middleware` Directory](#the-middleware-directory)
- [The `models` Directory](#the-models-directory)
- [The `modules` Directory](#the-modules-directory)
- [The `routes` Directory](#the-routes-directory)
- [The `translations` Directory](#the-translations-directory)
- [The `types` Directory](#the-types-directory)
- [The `views` Directory](#the-views-directory)

### The Root Directory

#### #The Dist Directory
The `dist` directory contains the compiled by TypeScript application. The application is being started from the `/dist/app.js` file.

#### #The Public Directory
The `public` directory contains all assets like Images, Videos, JavaScript and CSS files.

#### #The Src Directory
The `src` directory contains the core code of your application. We'll explore this directory in more detail soon in [The App Directory](#the-app-directory-1) section.

#### #The Storage Directory
The `storage` directory contains all logs and caches.

### The App Directory

#### #The Config Directory
The `config` directory, as the name implies, contains all of your application's configuration files. It's a great idea to read through all of these files and familiarize yourself with all of the options available to you.
#### #The Controllers Directory
Almost all of the logic to handle requests entering your application will be placed in this directory.
#### #The Lib Directory
The `lib` directory contains all custom written libraries for example the Controllers/Routes match library, the DB connection library, the Localization library, the Directories parse library etc. 

In the `lib` directory under helper's folder `/src/lib/helpers` are located the simple helper functions that do not store anything and are just for simple cases like object/array parsing and structuring, pages pagination etc.  
#### #The Mail Directory
The Mail directory contains all of your functions that represent emails sent by your application. There you will build the `from`, `to`, `subject` etc and will pass the required variables to the email EJS template.
#### #The Middleware Directory
The `middleware` directory contains all routing middlewares.
#### #The Models Directory
The `models` directory contains all of your Eloquent like model classes. Each database table has a corresponding "Model" which is used to interact with that table. Models allow you to query for data in your tables, as well as insert new records into the table. The name "Model" is taken as a definition from the Laravel's documentation, but each "Model" is simply a JavaScript Class with Methods that extends the main Class in `/src/models/main/Main.ts`.
#### #The Modules Directory
The `modules` directory could be considered as an important helpers folder. It contains modules that usually store or delete some data (not necessarily) like cookies for example and is used in many places in the app. Example of such a function is the `loginUserByEmailAndRole()` function which could be used from many places in the App.
#### #The Routes Directory
The routes directory contains all of the route definitions for your application contained in different files which separation could be also defined as route groups.
#### #The Translations Directory
The `translations` directory contains your translations and "localized routes" paths `/src/translations/lang/en/routes.ts`
#### #The Types Directory
The `types` directory contains the general types that are used globally in the App and to extend module's types like Passport JS `user` types, or the `global` types, or the Express `req` object types etc.
#### #The Views Directory
The `views` directory contains your EJS views.


## Frontend
### Express and EJS
Because of an SEO point of view, Node has to handle both frontend and backend for the search engine's important pages. EJS will help us for the frontend part. In our project, we have a default layout, which is extended (in a tricky way) by custom parameters and HTML. You will find the full [documentation of EJS here.](https://ejs.co/)

Our layout is build from 3 pieces: the [top part](#top-layout-part), the [main part](#main-layout-part) and the [bottom part](#bottom-layout-part) which are combined in one and extended by the [main part](#main-layout-part).

#### Top layout part
`/src/views/layouts/default/header.ejs`
```html
<!DOCTYPE html>
<html>
	<head>
		<% if(typeof layoutNoindex !== 'undefined') { -%>
			<meta name="robots" content="noindex, nofollow" />
		<% }; -%>
		<title>
			<%= 
				(typeof layoutTitle !== 'undefined' && layoutTitle !== '' ? 
					layoutTitle : 
					'Some default title'
				);
			%>
		</title>
	</head>
	<body>
		<!-- open app div-->
		<div id="app"> 
```
#### Bottom layout part
`/src/views/layouts/default/footer.ejs`
```html
		</div>
		<!-- close app div-->

		<script src="/js/app.js"></script>
		<%- (typeof layoutScripts !== 'undefined' ? layoutScripts : ''); -%>
	</body>
</html>
```

#### Main layout part
`/src/views/pages/home.ejs`
```html
<%- 
	include('../../layouts/default/header.ejs', {
			layoutTitle: "Home page title",
			layoutNoindex: true
		 }
	);
-%>

<h1>Home page</h1>
<div>Home page body</div>


<% 
	let layoutScripts = `
		<script>
			alert("I am custom javascript code added only on the home page!	")
		</script>
	`;
%>

<%- 
	include('../../layouts/default/footer.ejs', {
 			layoutScripts: layoutScripts
 		}
 	);
-%>
```

When we want to render the home page, we will pass directly the [main part](#main-layout-part) to the EJS render function in the Controller.
`/src/controllers/HomeController.ts`
```js
export function index(req: Request, res: Response, next: NextFunction) {
	return res.render("pages/home");
}
```

This will build the following HTML:
```html
<!DOCTYPE html>
<html>
	<head>
		<meta name="robots" content="noindex, nofollow" />
		<title>Home page title</title>
	</head>
	<body>
		<!-- open app div-->
		<div id="app"> 
			<h1>Home page</h1>
 			<div>Home page body</div>		
		</div>
		<!-- close app div-->

		<script src="/js/app.js"></script>
		<script>
			alert("I am custom javascript code added only on the home page!	")
		</script>
	</body>
</html>
```
Each string that we pass form the view could be translated, but we will get back to this example with additional explanations how to achieve it later in the docs.
## Routing
You are always free to do the things in the standard Express JS way, but to take advantage of the Localization, [Named routes](#url-generation-named-routes) and Laravel like Controllers, you will need to follow up the documented guides for the routes.

**There are two ways to register the routes:**
- by providing the trace of an object exported by the `/src/translations/lang/:lang/routes.ts` file, from where the final path will be retrieved (usually for get requests)
- by entering the final path directly (usually for post requests, because we could post the language as a parameter if necessary instead of including it in the URL and creating multiple routes for each locale)



### Using routes path trace
#### Create a route group
`/src/routes/localized.ts`
```js
export default [
    {
        // Request method
        method: "get", 
        // Path in /src/translations/lang/:lang/routes.ts folder from where the pattern will be get
        path: "routes.home", 
        // Controller name and method located in /src/controllers/...
        controller: "HomeController@index", 
        // Name of the route which will be prefixed with language. 
        // Final route name will be: en_get_home_.index. 
        // It must begin and end with underscore due to parsing purposes.
        name: "_get_home_.index", 
    }
];
```

#### Include the route group in the app.ts
`/src/app.ts`
```js
import { namedRoutes } from "./lib/route/route.js";
import localizedRoutes from "./routes/localized.js";

app.use(namedRoutes(localizedRoutes));
```

The `namedRoutes()` function will parse the routes in the array from `/src/routes/localized.ts` and will register them with the corresponding controllers (and the registered middlewares in the controllers for each path) and name which we could use to retrieve the URL (described later in the docs).

#### Create the path trace for the locales you need
If we want to have a home page only in English language, then we will add the route only in the `/src/translations/lang/en/routes.ts` file.

```js
export default {
    home: "/", //get
};
```


In case we want to have the home page for Bulgarian language as well, we will add it in the `/src/translations/lang/bg/routes.ts` file.

```js
export default {
    home: "/", //get
};
```


### Using routes path directly
Now let's create another route group with two routes for login form authentication.
```js
{
    method: "get",
    path: "routes.login",
    controller: "Auth/LoginController@index",
    name: "_get_login_.index",
},
{
    method: "post",
    path: "/post-login",
    controller: "Auth/LoginController@handleLoginForm",
    name: "post_login_.handleLoginForm",
}
```

The login index page is registered the same way as the home page, but you will notice that the `path` for the login form where we post it, doesn't contain a trace to the route that will be retrieved from an object exported by the `/src/translations/lang/:lang/routes.ts` file, but contains the path itself `/post-login`.


This means the `http://localhost:3000/post-login` post url won't be registered for each language with prefix, but will be registered only once the way it is, but we could still take advantage of the [Named routes](#url-generation-named-routes) feature and retrieve its value via the route name `post_login_.handleLoginForm` from anywhere in the code: 

`/src/views/pages/auth/login.ejs`
``` html
<form
    action="<%= locals.route('post_login_.handleLoginForm'); %>"
    method="POST"
    id="login-form"
>
```

## URL generation (named routes)
Named routes allow the convenient generation of URLs or redirects for specific routes.


### Generating URLs To Named Routes
Once you have assigned a name to a given route, you may use the route name when generating URLs.


#### Generating URL from Controller
Example how to generate a URL from a Controller (for redirect reasons for example) for routes without dynamic parameters.
```js
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";

let url = getNamedRouteUrl (
    req.locale + "_get_login_.index"
);

// url = http://localhost:3000/login
```


If the named route defines parameters, you may pass the parameters as the second argument to the route function. The given parameters will automatically be inserted into the generated URL in their correct positions. Only the values of parameters with matched keys will be inserted, the other parameters that do not match will be ignored.
```js
// in /src/translations/lang/bg/pages/auth.ts
export default [
    {
        method: "get",
        path: "routes.emailVerificationLinkCheck",
        controller: "Auth/EmailVerificationController@emailVerificationLinkCheck",
        name: "_get_email_verification_.emailVerificationLinkCheck",
    }
];

// in /src/routes/auth.ts
export default {	
	emailVerificationLinkCheck: "/auth/email-verify/:hash", //get
};

// in Controller
import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";

let url = getNamedRouteUrl (
    req.locale + "_get_email_verification_.emailVerificationLinkCheck",
    {
        hash: "378yfe87h837f87364873648276d827f62fg872f686",
        someOtherParameter: "will-be-ignored-for-no-match"
    }
);

// url = http://localhost:3000/bg/auth/email-verify/378yfe87h837f87364873648276d827f62fg872f686
// As you can see the "someOtherParameter"'s value is not included in the url as there is no such key in the path trace
```


If you pass additional parameters in string format these strings will be attached to the url in the order they are passed.

```js
let url1 = getNamedRouteUrl (
    req.locale + "_get_email_verification_.emailVerificationLinkCheck",
    {
        hash: "378yfe87h837f87364873648276d827f62fg872f686",
        someOtherParameter: "will-be-ignored-for-no-match"
    },
    "user=10",
    "country=china",
    "#top"
);

// url1 = http://localhost:3000/bg/auth/email-verify/378yfe87h837f87364873648276d827f62fg872f686?user=10&country=china#top

let url2 = getNamedRouteUrl (
    req.locale + "_get_email_verification_.emailVerificationLinkCheck",
    "user=10",
    "country=china",
    "#top"
);

// url2 = http://localhost:3000/bg/auth/email-verify/378yfe87h837f87364873648276d827f62fg872f686?user=10&country=china#top

```

**The `getNamedRouteUrl()` function returns `/` if no route with such name was found.**

#### Generating URL from EJS
To generate a route from an EJS file, use the following helper:
```html
<form
    action="<%= locals.route('post_login_.handleLoginForm'); %>"
    method="POST"
    id="login-form"
>
```

**The function `locals.route()` is a reference to the 'getNamedRouteUrl()' function.**

## ORM
In this project there isn't any ORM library installed. Instead, I have created my own which looks similar to Laravel's Eloquent. It doesn't work exactly like Laravel's ORM because I am only covering the basic and most common use cases for small projects. In case you need to make a more complicated query you can always use the [PG library](https://www.npmjs.com/package/pg) directly to build it or use the [getRaw()](#getraw-method) method and pass the query string which will do the same.

#### Creating Model
To use the custom ORM, first you need to create a Model to make the connection with the table in the DB.

Here is an example of a Model for Users. You need to pass the `table name` as a first argument to the `super()` function inside the Model Constructor and the `req` and `res` as a second and third argument.

`/src/models/user/User.ts`
```js
import { Model } from "../main/Main.js";

import { Request, Response } from "express";

// connecting to table_name "users" in our PostgreSQL DB
class User extends Model {
    constructor(req?: Request, res?: Response) {
        super("users", req, res);
    }
}

export { User };
```


#### Adding Custom Method
You can add custom methods for the registered Model

`/src/models/user/User.ts`
```js
class User extends Model {

    ...

    // adds a findUserByEmail() method to the User's model because it will be used very frequently in the app to find the user via email.
    async findUserByEmail(email: string) {

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
}

export { User };
```

#### Building queries
Making a simple query is very similar to the Laravel Eloquent Query builder.

`/src/controllers/Admin/UserController.ts`
```js
import { User } from "../../models/user/User.js";

// get all users where the user's first name is John, order the returned records descending by the table column "created_at" and "paginate" by showing "2 records per page".
let users = await new User(req, res) // we need to pass the req and res here only if we are using pagination
    .where("name", "=", "John")
    .orderBy("created_at", "desc")
    .paginate(2)
    .get();
```

#### Query Methods

I have prepared methods only for a few most used query methods. Each of them returns the array of the fetched records or NULL if nothing was found.

- [findById()](#findbyid-method)
- [update()](#update-method)
- [save()](#save-method)
- [delete()](#delete-method)
- [where()](#where-method)
- [orWhere()](#orwhere-method)
- [orderBy()](#orderby-method)
- [paginate()](#paginate-method)
- [first()](#first-method)
- [get()](#get-method)
- [getRaw()](#getraw-method)

##### FindById Method
The `findById(x :number)` method accepts a single argument of type number and fetches only the first row that has column name "id" with value equal to that number.

```js
// get the first user with id 25.
let user = await new User().findById(25);
``` 

The interesting part here is that you can edit the record directly and then call the [`update` method](#update-method).

```js
// get the first user with id 25.
let user = await new User().findById(25);
if(user) {
    user.verified = true;
    await user.update();
}
```

IMPORTANT: You can chain the [`update`](#update-method) or [`save`](#save-method) or [`delete`](#delete-method) methods on any method with response of type ModelInterface. This means that the `get()` method which returns a LooseObject or null can't be used with the [`update` method](#update-method) for example. You can see how we have created another custom method [`findUserByEmail()`](#adding-custom-method) that is returning a response of type ModelInterface.


##### Update Method
The `update()` method doesn't accept any arguments. It is used to update certain rows column values after they are being fetched first. It returns the updated rows in an array or NULL if nothing was updated. It can update only a single row at a time.

```js
let user = await new User().findUserByEmail("custom@gmail.com");
user.password = "123456";
let updateSuccess = await user.update();
if(updateSuccess) { ... }
```


##### Save Method
The `save()` method is used to store new rows in the DB.

```js
let user = new User() as LooseObject;
user.name = "John";
user.email = "custom@gmail.com";
user.password = "123456";
await user.save();
```

##### Delete Method
The `delete()` method is used to delete rows in the DB.

```js
let user = await new User().findUserByEmail("custom@gmail.com");
if(user) await user.delete();
```

##### Where Method

The `where(x: string, y: string, z: string | number)` method is used to add "where" clauses to the query. It requires three arguments. The first argument is the name of the column. The second argument is an operator, which can be any of the database's supported operators. The third argument is the value to compare against the column's value.

For example, the following query retrieves users where the name is equal to John and the id is greater than 35 and the email includes "@gmail.com":
```js
let users = await new User()
    .where("name", "=", "John")
    .where("id", ">", 35)
    .where("email", "LIKE", "%@gmail.com%")
    .get();
```

##### OrWhere Method
When chaining together calls to the query builder `where()` method, the `where` clauses will be joined together using the `and` operator. However, you may use the `orWhere` method to join a clause to the query using the `or` operator. The `orWhere(x: string, y: string, z: string | number)` method accepts the same arguments as the `where()` method.

For example, the following query retrieves users where the name is equal to John and the id is greater than 35 and the email includes "@gmail.com" or "@mail.de":
```js
let users = await new User()
    .where("name", "=", "John")
    .where("id", ">", "35")
    .where("email", "LIKE", "%@gmail.com%")
    .orWhere("email", "LIKE", "%@mail.de%")
    .get();
```


##### OrderBy Method
The `orderBy(x: string, y: "desc" | "asc")` method allows you to sort the results of the query by a given column. The first argument accepted by the `orderBy()` method should be the column name you wish to sort by, while the second argument determines the direction of the sort and may be either `desc` or `asc`:

```js
let users = await new User() 
    .where("name", "=", "John")
    .orderBy("created_at", "desc")
    .get();
```

To sort by multiple columns, you may simply invoke orderBy as many times as necessary:
```js
let users = await new User() 
    .where("name", "=", "John")
    .orderBy("name", "desc")
    .orderBy("email", "asc")
    .get();
```

##### Paginate Method
The `paginate(x: number)` method accepts one argument of type number to define how many records should be returned per page. When you use the `paginate()` method you need to pass the `req` and `res` when you initiate the Model. The total number of pages is attached to the `locals.pagination` property so it could be used in the views to display the pagination navigation bar.

```js
let users = await new User(req, res) // we need to pass the req and res here only if we are using paginate() method
    .where("name", "=", "John")
    .orderBy("created_at", "desc")
    .paginate(2)
    .get();
```


##### First Method
The `first(x?: string[])` method returns only the first row from the query. It accepts one optional parameter of type array with the column names which values you want to fetch. In case you don't pass anything a wildcard * will be used to return all row columns values. This method basically calls the `get(x?: string[], y?: true)` method by passing two arguments - the first is the array of the column names, and the second is with the value of true. The `first()` method should be called at the end of the methods chain and should not be combined with the `get()` or `getRaw()` methods. The `first()` method returns NULL if no records were found.

```js
// return the first user with name John and all of its columns values
let user = await new User() 
    .where("name", "=", "John")
    .first();

// user = [{id: 5, name: 'John', email: 'custom@gmail.com' }]
```

Now let's retrieve only the email and name:
```js
// return the first user with name John and only the email and name columns values
let user = await new User() 
    .where("name", "=", "John")
    .first(['email', 'name']);

// user = [{name: 'John', email: 'custom@gmail.com' }]
```

##### Get Method
The `get(x?: string[], y?: boolean)` is the key method that builds the query and should be called at the end of the methods chain. It accepts two optional arguments. The first argument accepted by the `get()` method should be of type array with the column names which values you want to fetch, while the second argument determines if it should fetch only the first record or query the DB for all matched records. In case you don't pass anything as a first argument a wildcard * will be used to return all row columns values. If the second argument is true it will fetch only the first record, if false or not passed it will fetch all records. The `get()` method returns NULL if no records were found.

```js
// Get all records with all columns values for users with name John
let users = await new User()
    .where("name", "=", "John")
    .get();

// Output
/*
users = [
  {
    id: 1, 
    name: 'John', 
    email: 'custom@gmail.com'
  }, 
  {
    id: 2, 
    name: 'John', 
    email: 'custom@mail.de'
  }
]
*/

// Get all records for users with name John but return only the email column value
let users = await new User()
	.where("name", "=", "John")
	.get(['email']);

// Output:
/*
users = [
  {
    email: 'custom@gmail.com'
  }, {
    email: 'custom@mail.de'
  }
]
*/
```

##### GetRaw Method

The `getRaw(x: string)` method accepts one argument of type string which is the raw query string that will be executed to query the DB. It returns the raw response from the DB.

```js
import { Model } from "../models/main/Main.js";

let users = await new Model().getRaw("SELECT * FROM users WHERE name='John'")

// Output
/*
users = [
  {
    id: 1, 
    name: 'John', 
    email: 'custom@gmail.com'
  }, 
  {
    id: 2, 
    name: 'John', 
    email: 'custom@mail.de'
  }
]
*/
```
## Controllers
Instead of defining all of your request handling logic as middlewares in your route files, you may wish to organize this behavior using "controller" functions. Controllers can group related request handling logic into a single file. For example, a `RegisterController` file might handle all incoming requests related to the registration process like displaying the registration page and handle the registration form post request. By default, Controllers are stored in the `/src/controllers` directory. The default Controllers directory could be changed from the `/src/config/controllers.ts` configuration file.

### Wrap route middlewares with Controllers
To be able to take advantage of the Controllers, you need to use the `Ctrlrs(x: string)` function. It accepts a single argument of type string which contains the Controller file location and the path **main middleware** which is exported from the Controller. The `Ctrlrs` function returns an array with the parsed middlewares (the **main middleware** and attached to it middlewares for which will talk about later) exported from the Controller that need to be executed for the route.

Let's take a look at the following example where we register two routes to handle the user registration. The `@` is separating the Controller path `Auth/RegisterController` from the controller **main middleware** `index` for which we will talk later. 

```js
import { Router } from "express";
import { Ctrlrs } from "../controllers/controllers.js";

let router = Router();
// display the register page
router.get(`/register`, Ctrlrs("Auth/RegisterController@index"));
// handle the registration form
router.post(`/register`, Ctrlrs("Auth/RegisterController@handleRegistrationForm"));
```

### Writing Controllers

In the `RegisterController` we are exporting a simple function with name `index` which is a **main middleware** for the `/register` get route. The **main middleware** `index` returns the rendered EJS view for the page. 

`/src/controllers/Auth/RegisterController.ts`
```js
export function index(req: Request, res: Response, next: NextFunction) {
    return res.render("pages/auth/register");
}
```

#### Global Middlewares

Here comes the interesting part. 

We could attach a list of **global middlewares** for all **exported main middlewares** in the `RegisterController` that will be executed before the **main middlewares**. For that purpose we must declare a new variable in the Controller with name `middleware` which we will call **global middleware**. Its value is with the type of array and contains the middlewares that will be executed in the order they are passed before the **main middlewares**. 

The **global middlewares** are optional and you could skip declaring it.

In the example below, we have set two **global middlewares** for all **main middlewares** in the `RegisterController`. 

`/src/controllers/Auth/RegisterController.ts`

```js
export const middleware = [methodParser, setLocale];

export function index(req: Request, res: Response, next: NextFunction) {
    return res.render("pages/auth/register");
}

```

The way they will be executed will be: `[methodParser, setLocale, index]`

```js
router.get(`/register`, Ctrlrs("Auth/RegisterController@index"));
// is equal to:
router.get(`/register`, [methodParser, setLocale, index]);
```

#### Pre and Pos Middlewares

That's not the end. Except the **global middlewares** we could attach middlewares only for particular **main middlewares** which could execute before or after the **main middleware**. For this purpose we will extend the **main middleware** with two properties `middleware` (Pre) and `posmiddleware` (Pos).

For example, if we want to have csrf protection for the registration form we need to use the middleware [`csurf`](https://www.npmjs.com/package/csurf)

```js
import csrf from "csurf";

/* 
 ** Create the CSRF middleware. This middleware could be relocated in a different 
 ** directory and then imported, but to keep it simple I have declared it here.
*/
const csrfProtection = csrf(csrfCookieDefaultCnf);

// global middlewares
export const middleware = [methodParser, setLocale];

// middlewares that will be executed after the global middlewares and before the main middleware
index.middleware = [csrfProtection, isLoggedIn];


// the main middleware
export function index(req: Request, res: Response, next: NextFunction) {
    return res.render("pages/auth/register", { csrfToken: req.csrfToken() } );
}


// middlewares that will be executed after the main middleware if you need it for some reason
index.posmiddleware = [];

```

The order these middlewares will be executed is `[methodParser, setLocale, csrfProtection, isLoggedIn, index]`.
The Pre and Pos middlewares are optional so you could skip declaring them.

You can declare as many as you want **main middlewares** in one Controller.

**NOTE: All route groups that are registered via [`namedRoutes()`](#include-the-route-group-in-the-appts) function are using Controllers by default.**


## Middlewares

Middleware provides a convenient mechanism for inspecting and filtering HTTP requests entering your application. For example, our app includes a middleware that verifies the user of your application is authenticated. If the user is not authenticated, the middleware will redirect the user to your application's login screen. However, if the user is authenticated, the middleware will allow the request to proceed further into the application.

Additional middleware can be written to perform a variety of tasks besides authentication. For example, a logging middleware might log all incoming requests to your application or check the request method. There are several middleware included in the framework, including middleware for authentication and CSRF protection. All of these middleware are located in the `/src/middleware` directory.

### Auth Middleware
The `auth` middleware checks if the user is authenticated (if the JWT access token is valid and in some case that is explained below if there is such user in the DB). If not it clears all cookies and redirects to the login page by default. 

```js
// in Controller
import { auth } from "../middleware/auth/auth.js";

// protect all main middlewares in the controller with the auth middleware
export const middleware = [await auth()];
```

##### How it works behind the scenes

The `auth` middleware first checks for `authorization` header and if there isn't such it checks for access token cookie (this is useful for server side rendering pages like Blog archives page where we don't use SPA and we need SEO). If there isn't an access token cookie it checks for refresh token cookie and if valid it issues a new access token and attaches it to the `authorization` header with `Bearer` prefix. Then it decodes the access token to extract the user info and attaches it to the Request object under `req.user` and sets `res.locals.isLoggedIn` to true (so we could use it directly in the EJS template to display link in the navigation bar to the profile page only for logged in users for example).

Only in the process of reissuing access token it makes a hit to the Redis DB where we store the refresh tokens to check if the refresh token is valid or not and if valid it makes a hit to the Postgre DB to check if there is such user and what are it's roles so it could store the user email and roles in the new encoded access token.

At first look you might think that this is like using sessions but it's not, because if you provide a valid `authorization` header with access token or access token cookie in the first place, there won't be any interactions with the DB at all. Only the access token will be verified and decrypted with the ACCESS_TOKEN_SECRET key from the .env file. 

The common with the sessions way of authentication is that we are storing the refresh tokens in Redis, instead of creating a black list for refresh tokens (in case we want to block or logout someone), but I believe as Redis is fast enough there isn't any big difference, but having all refresh tokens stored we could use it for statistics or logout all users at once without creating a huge black list to keep refresh tokens for a month until they expire. When a user logs in or out any previously issued refresh tokens are deleted from Redis.

**So this implementation could be used for server side rendering and SPA with enough security and lighter as possible in different scenarios.**

##### Accepted arguments

The `auth(redirectToUrlOrReturnErr401: string | boolean)` middleware could accept one optional argument of type boolean or string. If nothing is passed it will redirect to the default login page exported from the /src/config/auth/general.ts config file. If a url as string is passed it will redirect to the passed url on auth failed. If false is passed it will return 401 error page. If true is passed it will return 401 json response. In all cases if auth fails it clears all JWT cookies if there are any.

```js
// redirects to the default login page from the /src/config/auth/general.ts config file
export const middleware = [await auth()];

// redirects to the "https://www.example.com/login" url
export const middleware = [await auth("https://www.example.com/login")];

// returns 401 json error code
export const middleware = [await auth(true)];

// returns 401 rendered page
export const middleware = [await auth(false)];
```

**NOTE: The `auth` middleware is usually called in combination with the [Roles middleware](#roles-middleware).**

### SetIsLoggedIn Middleware
The difference between [Auth Middleware](#auth-middleware) and SetIsLoggedIn Middleware is that the [Auth Middleware](#auth-middleware) is redirecting you to the login page while the SetIsLoggedIn Middleware is only setting the `req.user` and `res.locals.isLoggedIn` which could be used for home page for example to know if we should display the registration and login buttons in the navigation panel. If we call the [Auth Middleware](#auth-middleware) there is no need to call the `setIsLoggedIn` middleware.

```js
// in Controller
import { setIsLoggedIn } from "../middleware/auth/auth.js";

export const middleware = [setIsLoggedIn];
```

### Roles Middleware

The `roles` middleware is used to check if a user is authorized to access the content. The roles are exported from a config file located in `/src/config/roles/roles_list.ts`. If authorization fails, it returns status 403 and renders the 403 page or sends a JSON response.

It accepts two arguments. The first argument is required and is of type of array. In the array are the role code numbers. The second argument is optional and is of type boolean. If true is passed, the `roles` middleware will return a 403 json error, if false or nothing is passed it will return status 403 and will render the 403 page.

```js
// In Controller
import { auth, roles } from "../middleware/auth/auth.js";
import { ROLES_LIST } from "../config/roles/roles_list.js";

/*
 **  Аllow only users with admin and user access rights to view
 ** the page and return the rendered 403 page if user is not authorized
*/
export const middleware = [await auth(), roles([ROLES_LIST.admin, ROLES_LIST.user])];

/*
 ** Аllow only users with admin and user access rights to view 
 ** the page and return 403 json error if user is not authorized
*/
export const middleware = [await auth(), roles([ROLES_LIST.admin, ROLES_LIST.user], true)];
```


**NOTE: Roles Middleware must be called after the [Auth Middleware](#auth-middleware), because it uses the req.user object which is attached by the [Auth Middleware](#auth-middleware).**

In case you skip calling the `auth` middleware before the `roles` middleware is not crucial, but the user will see the interface as logged out user no matter he has the jwt cookies attached. For example the user will see the login and register button again while he is on the page that he doesn't have rights to visit. If he goes to another page where he has rights to visit everything will be back to normal. All this will be avoided if you call the `auth` middleware first which is logical because first you need to make sure the user is logged in and then check what are his roles. In other words, the authentication (`auth`) is before the authorization (`roles`).


### Guest Middleware
The `guest` middleware simply checks if the user is not authenticated. It could be used for login and register pages for example, so only logged out users have access to it.

```js
// In Controller
import { guest } from "../../middleware/auth/auth.js";

export const middleware = [guest];
```


### SetPathToLocals Middleware

The `setPathToLocals` middleware is mainly used from the helper [`getAlternateLanguagesUrls()`](#getalternatelanguagesurls) located in `/src/lib/helpers/localization/getAlternateLanguagesUrls.ts` to create the alternate urls of the current page language. It attaches the `req.route.path`, `req.path`, `req.params`, `req.url` to the `res.locals.urlInfo` object. We are going to need it anywhere we want to have the [alternate urls](#getalternatelanguagesurls) in the header or the navigation bar.

```js
// In Controller
import { setPathToLocals } from "../middleware/locals/setPath.js";

export const middleware = [ setPathToLocals ];

/* 
 ** Now we could access the res.locals.urlInfo object which will 
 ** look like this if we visit http://www.example.com/blog/dogs page:
*/
res.locals.urlInfo = {
    originalPath: '/blog/:slug', //req.route.path
    path: '/blog/dogs', //req.path
    params: { slug: 'dogs' }, //req.params
    url: '/blog/dogs' //req.url
}
```

### Credentials Middleware
The `credentials` middleware is to protect your app from CORS and is setting the header Access-Control-Allow-Credentials to "true" only if the origin that is sending the request is in our allowed origins exported from the config `/src/config/cors/allowedOrigins.ts`. It must be set before the cors middleware because otherwise it will throw a CORS error. This is used for the `fetch()` function for example where we are accessing our REST API from another domain with React for example and we need to add the `{credentials: "include"}` to the request. It is up to you if you want to use it for each request as it is set by default along with the [`cors` middleware](https://www.npmjs.com/package/cors).

```js
// In /src/app.ts file
import { credentials } from "./middleware/credentials.js";
import { corsOptions } from "./config/cors/corsOptions.js";

// credentials middleware must be called before cors middleware
app.use(credentials); 

// cors middleware
app.use(cors(corsOptions)); 
```

### MethodsParser Middleware
The `methodsParser` middleware simply compares the request method to the allowed methods exported from the config `/src/config/allowedReqMethods.ts`

```js
// In /src/app.ts
import { methodsParser } from "./middleware/requestMethod.js";

app.use(methodsParser);
```

### SetLocale Middleware
The `setLocale` middleware sets the current language to the `req.locale` and `res.locals.locale` by parsing the url or looking for a `Request-Language` header. First it checks the url to set the locale and if no valid locale is found in the url then it checks the `Request-Language` header. In case the header value is not in the list of supported locales listed in `/src/config/locale.ts`, the default locale exported from `/src/config/locale.ts` will be set.

The point of having an option to post the locale in a header is for cases when for example we don't want to define a POST route for each language /register; /bg/register; /de/register and etc and keep our routes clear by defining only "/register" route, where if we need to make a form validation for example and localize the returned error messages, we will need to know the locale to display localized response. For that purpose we will simply pass the locale with a header `Request-Language`.

```js
// In Controller
import { setLocale } from "../middleware/setLocale.js";

export const middleware = [setLocale];
```


Example how to use the `Request-Language` header
```js
//In Frontend form
fetch("/register", {
    method: "POST",
    headers: {
        "Request-Language": "bg",
    },
    body: ...,
})
```


### Validate Middleware
The `validate` middleware is more like a wrapper for the [`express-validator`](https://www.npmjs.com/package/express-validator) package looping through the different validation rules and making it more eye friendly to read. It accepts one argument which is the validation chain which will be explained later.

```js
// In Controller
import { validate } from "../middleware/validate.js";

index.middleware = [await validate([
    body("email")
        .exists()
        .withMessage("The email field is required")
        .bail()
        .notEmpty()
        .withMessage("The email field must not be empty")
        .bail(),
    body("name")
        .exists()
        ...
])
```

## Localization

Your app has the localization feature which means it could be translated in as many languages you want. The translation strings will be defined in objects exported from files that are placed within the `/src/translations/lang` directory. The directory path is defined in a config file `/src/config/locale.ts`.
```js
// it is ./dist instead of ./src because we are running the app from the dist folder.
export const translationsDir: string = './dist/translations/lang'; 
```

The url includes the language abbreviation in it except for the main language `default_locale` exported from `/src/config/locale.ts`. 
If our main language is 'en' for English, and we have Bulgarian (bg) and German (de) languages as well then the urls will be:

```
// for English home page
http://www.example.com

// for English blog page
http://www.example.com/blog


// for Bulgarian home page
http://www.example.com/bg

// for Bulgarian blog page
http://www.example.com/bg/blog


// for German home page
http://www.example.com/de

// for German blog page
http://www.example.com/de/blog

```


#### GetForLocale
The core function to retrieve a raw translation is the `getForLocale(path: string): string | undefined` function exported from `/src/lib/locale/locale.ts`. It accepts one argument of type string which represents the second part of the path to the translation location. Second part of the path means that there is one main path on first place called `translationsDir` which is exported from the config `/src/config/locale.ts` and is pointing to the default translations directory `/src/translations/lang`. The passed path extends the main path string. If the translation was not found on the provided path it returns `undefined`, otherwise it returns the translation in `string` format.

```js
import { getForLocale } from "./lib/locale/locale.ts"; 

let translation = getForLocale('en/pages/home.layoutTitle')
/* 
 ** Тhis will search for key 'layoutTitle' in object exported 
 ** from : '/src/translations/lang/en/pages/home.ts'
*/

// If the exported object in '/src/translations/lang/en/pages/home.ts' is:
export default {
    layoutTitle: "I am the page title",
    layoutDescription: "I am meta page description",
    title: "I am the h1"
};

// Тhen the output of the `translation` variable will be: "I am the page title".
```

If the path points to a key with a value which is with a type different than string, it will be stringified and returned as string.

```js
let translation = getForLocale('en/pages/home.layoutTitle')

export default {
    layoutTitle: {
        firstPart: "I am the",
        secondPart: "page title"
    },
    layoutDescription: "I am meta page description",
    title: "I am the h1"
};

/* 
 ** Тhen the output of the `translation` variable will 
 ** be: '{"firstPart":"I am the","secondPart":"page title"}'
*/
```

We could retrieve the nested key only as well:

```js
let translation = getForLocale('en/pages/home.layoutTitle.firstPart')

export default {
    layoutTitle: {
        firstPart: "I am the",
        secondPart: "page title"
    },
    layoutDescription: "I am meta page description",
    title: "I am the h1"
};

// then the output of the `translation` variable will be: "I am the".
```

#### GetTranslationForLocale
The `getTranslationForLocale(path: string, paramsArray?: {[key: string | number]: string | number})` function is exported from `/src/lib/locale/locale.js`. It extends the functionality of the [`getForLocale`](#getforlocale) function and is the main function you will use in your app because it has some very useful features. It accepts two arguments. The first is of type string and represents the path to the translation. The second argument is optional and is an object with KEY `string | number` - VALUE `string | number` type pairs.

##### First feature

The first feature is that if the translation was not found for the provided locale it will search for the same translation path in the fallback locale `fallback_locale` exported from `src/config/locale.ts` config file which could be also considered as default locale. In other words, if for some reason it can't find the Bulgarian language translation for the provided path it will search for the English language translation for the same path if the English language is our fallback locale. If the translation was not found in our fallback locale as well, it will return an empty string `""`. In the same situation the [`getForLocale`](#getforlocale) will return and display `undefined` instead of an empty string which is unacceptable for our frontend and we need to make an explicit check if it returns undefined to display something else.

```js
import { getTranslationForLocale } from "../lib/locale/locale.js";

// searches for Bulgarian translation in path '/src/translations/lang/bg/pages/home.layoutTitle'
let translation = getTranslationForLocale('bg/pages/home.layoutTitle');

/*
** In case we forgot to add the translation for the Bulgarian language and 
** our fallback locale is set to 'en', it will search for the 
** translation in path '/src/translations/lang/en/pages/home.layoutTitle'
*/

/*
** If the translation was not found neither for the Bulagarian and 
** the fallback language (English), it will return an empty string "".
*/
```


##### Second feature
The second feature is that we can use dynamic variables for our translations. For example if we want to have a validation rule that contains a localized response message with the user email in it. The dynamic variables that we will replace are prefixed with `:` in the exported translations object. To replace the dynamic variables the `getTranslationForLocale` function is using the [`getTranslationWithReplacedParams`](#gettranslationwithreplacedparams) function.

```js
/* 
 ** Тhe exported translations object 
 ** in '/src/translations/lang/en/pages/register.validationMsg.emailAlreadyTaken'
 */
export default {
    validationMsg: {
        emailAlreadyTaken: 
        "Your email :userEmail is already taken! Please enter a different email for your registration!"
    }
};

// Now we retrieve the translation passing the second argument as well
let translation = getTranslationForLocale('en/pages/register.validationMsg.emailAlreadyTaken', {
    userEmail: 'customer@gmail.com'
});

/*
** The output of the 'translation' variable will be: 
** 'Your email customer@gmail.com is already taken! Please enter a different email for your registration!'
*/
```

##### Third feature
It is not exactly a feature but more a helper but it's important. You can call the `getTranslationForLocale` function directly from your EJS files with two underscores function `locals.__(path, paramsArray)`.

```html
<!-- In /src/views/pages/home.ejs -->
<h1><%= locals.__(locals.locale + /pages/home.title') %></h1>

<!-- Above code will be rendered to -->
<h1>I am home page title!</h1>
```

#### GetTranslationWithReplacedParams
The `getTranslationWithReplacedParams(_translationString: string, paramsArray?: {[key: string | number]: string | number})` function is exported from `/src/lib/locale/locale.js`. In some cases you can directly inject the translations file in the controller and pass it to the view engine. Then from the EJS file you can directly pass the raw translation and the dynamic variables to be replaced in it to the `getTranslationWithReplacedParams` function. The `getTranslationWithReplacedParams` accepts two parameters. The first is of type string and is the raw translation, the second is optional and is an object with KEY `string | number` - VALUE `string | number` type pairs just like in the [`GetTranslationForLocale`](#gettranslationforlocale) function. It could be called with three underscores function from EJS with `locals.___(path, paramsArray)`.

```js
// In the home page Controller
import translations from '../translations/lang/en/pages/home.js';
export function index(req, res, next) {
    return res.render("pages/home", {
        translations: translations
    });
}

// The exported object from /src/translations/lang/en/pages/home.js
export default {
    title: "I am :appName :pageName page!"
};

// In /src/views/pages/home.ejs
<h1><%= locals.___(translations.title', {appName: "Animals Lovers", pageName: "home"}) %></h1>


// Above code will be rendered to
<h1>I am Animals Lovers home page!</h1>
```


## Validations
For the form validations we are using [`express-validator`](https://www.npmjs.com/package/express-validator) that is wrapped in custom middleware called [`validate`](#validate-middleware). You will find the documentation for the express validator here: [express validator documentation](https://express-validator.github.io/docs/). As we are usually using a localized validation, below is an example how to work with it.

```js
// In Controller
import { validate } from "../middleware/validate.js";
import { getTranslationForLocale } from "../lib/locale/locale.js";

index.middleware = [await validate([
    body("email")
        .exists() // check if email post parameter exists in body
        .withMessage((value, { req, location, path }) => {
            /* 
                ** Get's the `exists` key value from the exported object from 
                ** '/src/translations/lang/bg/validation.ts' and passes another 
                ** translated string to replace the dynamic variable declared 
                ** by `:argument` in it.
            */
            return getTranslationForLocale( 
                req.locale + "/validation.exists",
                {
                    attribute: getTranslationForLocale(
                        req.locale + "/pages/auth/register.validation.email"
                    ),
                }
            );
        })
        .bail()
        .isString() //check if the email post parameter is string
        .withMessage((value, { req, location, path }) => {
            return getTranslationForLocale(
                req.locale + "/validation.string",
                {
                    attribute: getTranslationForLocale(
                        req.locale + "/pages/auth/register.validation.email"
                    ),
                }
            );
        })
        .bail(),
    body("name")
        .exists()
        ...
])
```


## Mail
For the emails we are using the package [nodemailer](https://www.npmjs.com/package/nodemailer). All the email send functions are stored in `/src/mail/` directory. In the email function we are importing the configuration files for the mail server located in the `/src/config/mail` directory. Mailtrap.io is set by default but you can change it to any provider you wish.

In the example below we are sending a localized email with an email verification link in it which is required to complete the registration process. From the RegisterController we are calling the email send function and are rendering an EJS template for the email HTML. The global `global.__viewsDirname` sets the path to the `/src/views/` directory where the EJS templates are. The user will receive the email in the language he has chosen for the registration form page.

```js
// In Controller
import { sendVerifyEmailMail } from "../../mail/sendVerifyEmailMail.js";
...
// send the email with the verification link to the client
await sendVerifyEmailMail(
    user.email,
    user.name,
    emailVerificationLink.link,
    req.locale
);



// In the `/src/mail/sendVerifyEmailMail.ts`
// We are rendering an EJS file for the email HTML
import nodemailer from "nodemailer";
import { transporterConfig } from "../config/mail/transporterConfig.js";
import { mailServerConfig } from "../config/mail/mailServerConfig.js";
import { renderFile } from "ejs";
import { setLoggerExtraInfo } from "../lib/logger/logger.js";
import { getTranslationForLocale } from "../lib/locale/locale.js";

export async function sendVerifyEmailMail(
    email: string,
    name: string,
    emailVerificationLink: string,
    locale: string | undefined
) {
    try {
        let transporter = nodemailer.createTransport(transporterConfig);

        let data = await renderFile(
            global.__viewsDirname + "/mail/verifyEmail.ejs",
            {
                email: email,
                name: name,
                locale: locale,
                emailVerificationLink: emailVerificationLink,
                __: getTranslationForLocale,
            }
        );

        let mail = await transporter.sendMail({
            from: {
                name: mailServerConfig.name,
                address: mailServerConfig.from,
            },
            to: [
                {
                    name: name ? name : "",
                    address: email,
                },
            ],
            subject: getTranslationForLocale(
                locale + "/emails/verifyEmail.subject"
            ),
            text: getTranslationForLocale(
                locale + "/emails/verifyEmail.subjectText"
            ),
            html: data,
        });

        return mail;
    } catch (err: any) {
        err = setLoggerExtraInfo(err, {
            reason: `There was a problem sending the email to: ${email}`,
        });
        throw err;
    }
}
```

## Helpers
The app includes a few global "helper" functions, but you are free to modify them, delete them and do anything at your own convenience.

#### GetAlternateLanguagesUrls
The `getAlternateLanguagesUrls` helper is used to build the alternates array `{slug: string, language: string}[]`. In our app we are using it to add the alternates in the head and in the navigation bar to switch between page languages. It is attached to the `locals.helpers` object so it could be used from EJS which will be the most common use case.

```html
<!-- In EJS header file -->

<% locals.alternateSlugs = locals.helpers.getAlternateLanguagesUrls(locals.urlInfo, locals.alternates); %>
<!DOCTYPE html>
<html>
  <head>
    <% if(locals.alternateSlugs){
      locals.alternateSlugs.map(slug=>{
        %>
          <link rel="alternate" hreflang="<%= slug.language; %>" href="<%= slug.slug; %>">
        <%
      });
    }; %>
...
```

The `getAlternateLanguagesUrls` helper accepts two arguments and works only on `GET` method routes. 

The **first argument** is containing an object with the entire information of the url and route address that is stored in the `res.locals.urlInfo` using the [`setPathToLocals` middleware](#setpathtolocals-middleware). It could be accessed via `locals.urlInfo` from the EJS.

The **second argument** is optional and is of type `array with objects` or `undefined` or `string`. 

If the **second argument** is of type `array with objects` it could be used in three ways depending on the type of the `parameters` property in the passed objects. We will use it (pass it) in cases when only some of the route dynamic parameters `/blog/:slug` must be changed according to the language which will be the most common use case ([first way](#first-way)) or there is a need to set entirely custom alternates ([second way](#second-way)) or mixed ([third way](#third-way)).

If the **second argument** is of type `string` it should be the `query string` that will be attached at the end of each alternate url. The [default way](#default-way) will be used to retrieve the alternates if the **second argument** is of type `string`.

###### Default way
-	If the **second argument** is `undefined` the helper will look for alternates by default from the named routes array `global.namedRoutes` which is declared when the app starts. The `getAlternateLanguagesUrls` will find all routes with the same `pathTrace` and will build the alternate urls array.

```js
// If we have global.namedRoutes with the following named routes:
global.namedRoutes = [
    {
        method: 'get',
        pattern: '/blog',
        controller: 'BlogController@archive',
        name: 'en_get_blog_.archive',
        pathTrace: 'routes.blogArchive'
    },
    {
        method: 'get',
        pattern: '/bg/blog',
        controller: 'BlogController@archive',
        name: 'bg_get_blog_.archive',
        pathTrace: 'routes.blogArchive'
    },
    ...
]

/*
 ** Output in EJS from calling getAlternateLanguagesUrls(locals.urlInfo) 
 ** without second argument
*/
[
    { slug: '/blog', language: 'en' },
    { slug: '/bg/blog', language: 'bg' }
]
```

- If the **second argument** is of type `string` it will just attach the passed string to the alternates from the example above.
```js
// Output in EJS from calling getAlternateLanguagesUrls(locals.urlInfo, "?age=30&gender=male") with second argument of type 'string'
[
    { slug: '/blog?age=30&gender=male', language: 'en' },
    { slug: '/bg/blog?age=30&gender=male', language: 'bg' }
]
```

###### First way
-    If the **second argument** is of type `array with objects`, where the object property `parameters` is of type `array with strings`, then the `getAlternateLanguagesUrls` will look for dynamic variables in the route to replace them in the order they are passed.
```js
/* 
 ** If route is '/blog/:slug1/:slug2' and we pass the following array to 
 ** the 'getAlternateLanguagesUrls' function as a second argument
*/
[
    {
        language: 'en',
        parameters: [
            'food',
            'dogs'
        ]
    },
    {
        language: 'bg',
        parameters: [ 
            'hrana',
            'kucheta'
        ]
    }
]
// Output:
// English url: /blog/food/dogs
// Bulgarian url: /bg/blog/hrana/kucheta
```

###### Second way
-    If the **second argument** is of type `array with objects`, where the object property `parameters` is of type `string` it will add it directly as a slug.
```js
/*
 ** If route is '/blog/:slug1/:slug2' and we pass the following array to 
 ** the 'getAlternateLanguagesUrls' function as a second argument:
*/
[
    {
        language: 'en',
        parameters: "/blog/food/dogs"
    },
    {
        language: 'bg',
        parameters: "/random/indeed"
    }
]
// Output:
// English url: /blog/food/dogs
// Bulgarian url: /random/indeed
```

###### Third way
-    The object property `parameters` in the `array of objects` could be a `string` for some of the objects and `array of strings` for the others (mixed).

An additional feature that will work for all the three ways of using the **second argument** is that each object in the `array of objects` could accept one more parameter named `queryStrings` which is of type `string` and will attach its value at the end of the alternate url.
```js
/*
 ** If route is '/blog/:slug1/:slug2' and we pass the following array to 
 ** the 'getAlternateLanguagesUrls' function as a second argument:
*/
[
    {
        language: 'en',
        parameters: "/random/food/dogs",
        queryStrings: "?meet=beef&baked=soft"
    },
    {
        language: 'bg',
        parameters: [ 
            'hrana',
            'kucheta'
        ],
        queryStrings: "?meet=teleshko&baked=alangle"
    }
]
// Output:
// English url: /random/food/dogs?meet=beef&baked=soft
// Bulgarian url: /blog/hrana/kucheta?meet=teleshko&baked=alangle
```


The `getAlternateLanguagesUrls` sorts the alternates via `language` property in the order you have exported them from your config `all_locale` array, located in `/src/config/locale.ts`.

```js
// In `/src/config/locale.ts`
export const all_locale: string[] = ['en', 'bg'];

// Alternates array will look like
[
    { slug: '/blog/dogs', language: 'en' },
    { slug: '/bg/blog/kucheta', language: 'bg' }
]


// If we switch the langs order in our `/src/config/locale.ts` config file:
export const all_locale: string[] = ['bg', 'en'];

// The result will be:
[
    { slug: '/bg/blog/kucheta', language: 'bg' },
    { slug: '/blog/dogs', language: 'en' }
]
```

**IMPORTANT: Any route where you want to use the alternate urls helper must call the [`setPathToLocals` middleware](#setpathtolocals-middleware). If you don't call it, you will have to build and pass the first argument manually.**

##### Example how to use the optional argument
An example for the [first use case](#first-way) is when there is a blog post with different translations which slugs are retrieved from a DB. We need to keep the original url structure `/blog/:slug` for the default language and `/:lang/blog/:slug` for the other languages, but change only part of the url with the language and slug depending on the post alternate languages.

For example if we have two translations of a blog post, where the main language is English and the alternate language is Bulgarian. The page which will be visited is: https://www.example.com/blog/dogs

```js
// In Controller

/* 
 ** You need to set setPathToLocals middleware which sets the locals.urlInfo object 
 ** and setLocale middleware which sets the req.locale to retrieve the opened blog post
*/
singleBlogPost.middleware = [setLocale, setPathToLocals];

export async function singleBlogPost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // get the requested blog post
        let post = await new Blog()
            .where("language", "=", req.locale as string)
            .where("slug", "=", req.params.slug as string)
            .orderBy("created_at", "desc")
            .first();
        /* 
            post = {
                id: '9',
                slug: 'dogs',
                language: 'en',
                common_ids: 9,
                title: 'Dogs',
                content: 'Dogs are cute',
                created_at: 2022-03-15T02:55:32.000Z,
                updated_at: null
            } 
        */

        if (!post) {
            res.status(404);
            return next();
        }

        // get the alternate blog posts
        let alternatePosts = await new Blog()
            .where("common_ids", "=", post.common_ids.toString())
            .get(["id", "language", "slug"]);
        /* 
            alternatePosts = [
                { common_ids: 9, language: 'en', slug: 'dogs' },
                { common_ids: 9, language: 'bg', slug: 'kucheta' }
            ]
        */

        if (!alternatePosts) {
            res.status(404);
            return next();
        }


        /* 
         ** structure them so we could pass them to 
         ** the getAlternateLanguagesUrls() helper as a second argument.
        */
        let alternates: customAlternateUrlsParamsArr = [];
        alternatePosts.map((x) => {
            return alternates.push({
                language: x.language,
                parameters: [x.slug]
            });
        });
        /*
            alternates = [
                { language: 'en', parameters: [ 'dogs' ] },
                { language: 'bg', parameters: [ 'kucheta' ] }
            ]
        */

        /*
         ** attach it to the res.locals.alternates so it could be used globally 
         ** from the EJS files instead of passing it down the chain until it reaches
         ** the function 'getAlternateLanguagesUrls()' which is positioned 
         ** in the template '<head></head>' DOM element.
        */
        res.locals.alternates = alternates;

        return res.render("pages/blog/singleBlogPost", {
            post: post,
        });
    } catch (err) {
        return next(err);
    }
}

// In the template EJS
<% locals.alternateSlugs = locals.helpers.getAlternateLanguagesUrls(locals.urlInfo, locals.alternates); %>

// Output
/*
 locals.alternateSlugs = [
    { slug: '/blog/dogs', language: 'en' },
    { slug: '/bg/blog/kucheta', language: 'bg' }
 ]
*/

/*
 ** Then do whatever you want with the returned array. 
 ** You can see how the :slug part is replaced with `dogs` for
 ** the main language and 'kucheta' for the Bulgarian language.
*/

// For example we could display it this way in the <head></head>
<head>
<% if(locals.alternateSlugs){
    locals.alternateSlugs.map(slug=>{
        %>
            <link rel="alternate" hreflang="<%= slug.language; %>" href="<%= slug.slug; %>">
        <%
    });
}; %>
</head>
<body>
...
```


#### CreatePaginationArr
The `createPaginationArr` helper is used when we want to display a pagination bar to navigate between the different pages for example when we have many blog posts but want to display only 5 blog posts per page.

The `createPaginationArr` is attached to the `locals.helpers` object so it could be accessed from the EJS files.

The `createPaginationArr` helper is exported from `/src/lib/helpers/pagination/paginationHelper.ts` and accepts three arguments:
- The first argument is of type `number` and defines the total pages count.
- The second argument is of type `number` and defines the current page we are at.
- The third argument is of type `number` and defines how many pages should be displayed before and after the current page.
```js
// In EJS file

/*
 ** If we have 11 pages and are on page 5 at the moment and 
 ** want to display 2 pages before and after the current one.
*/

let paginationArr = locals.helpers.createPaginationArr(11,5,2);
// Output: paginationArr = [1, '...', 3, 4, 5, 6, 7, '...', 11]
// Pagination bar in the DOM will look like:
< 1 ... 3 4 5 6 7 ... 11 >


// If we change the third argument to 1
let paginationArr = locals.helpers.createPaginationArr(11,5,1);
// Pagination bar in the DOM will look like:
< 1 ... 4 5 6 ... 11 >
```

Remember when in the [`paginate()`](#paginate-method) is mentioned that when you use this method you need to pass the req and res to the Model: 
```js
// In Controller
let blogPosts = await new Blog(req, res) // we need to pass the req and res here only if we are using pagination
    .where("language", "=", req.locale as string)
    .orderBy("created_at", "desc")
    .paginate(1)
    .get();
```

This is required because the [`paginate()`](#paginate-method) method attaches a `locals.pagination` object which contains the entire information we need to call the pagination helper with the required arguments:
```js
/*
 ** If we have told to the model to show 1 post per page and 
 ** at the moment are on page 5 in the url: https://www.example.com/blog?page=5&sky=blue
*/
locals.pagination = {
    curPage: 5, // the page we are currently at which is retrieved from the query parameter '?page=5'
    limit: 1, // how many blog posts to display per page
    path: '/blog', // the current path
    queryStr: { page: '5', sky: 'blue' }, // all the query strings of the opened page
    totalCnt: '11' // total count of the blog posts
}
```

To ease the understanding of how it works there is a template for a pagination bar located in `/src/views/includes/pagination/paginator.ejs`.
You can include it anywhere you need pagination and it will display the pagination bar. Feel free to style it any way you want or to create your custom pagination bar. It also has Prev and Next buttons.
```html
// In the blogs archive page
<%- include('../../includes/pagination/paginator.ejs'); %>
```

## Logging And Error Handling

### Error Handling
The Global error handling is done in the `/src/app.ts` file. There are two types of handled errors: [operational](#operational-errors) and [programming](#programming-errors). All errors are logged in `/src/storage/logs/*` directory and the path for the logs of the different error types could be configured from `/src/config/errors.ts`. In production the errors will be printed only in the error files. In development, the errors will be printed only in the terminal to ease the working process. To switch between development and production mode change the `NODE_ENV` to `development` / `production` in the `/.env` file.

#### Operational errors
Operational errors represent runtime problems. These errors are expected in the Node.js runtime and should be dealt with in a proper way. This does not mean the application itself has bugs. It means they need to be handled properly. Here’s a list of common operational errors: 
- failed to connect to server
- failed to resolve hostname
- invalid user input
- request timeout
- server returned a 500 response
- socket hang-up
- system is out of memory


##### Handle Operational Errors
The default operational error handling is done via [logger](#logger), but you could change it however you like.
```js
// in /src/app.ts

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    ...
}
```

The operational errors are logged into `/src/storage/logs/errors.log` and won't break the app as we don't want in case of request timeout for a particular user to stop the entire app. The user will simply get an error and could try to refresh the page to retrieve the data again. Meanwhile all the other users will continue working without interruptions.


#### Programming errors
Programmer errors are what we call bugs. They represent issues in the code itself. Here’s a common one for Node.js, when you try reading a property of an undefined object. It’s a classic case of programmer error. Here are a few more:

- called an asynchronous function without a callback
- did not resolve a promise
- did not catch a rejected promise
- passed a string where an object was expected
- passed an object where a string was expected
- passed incorrect parameters in a function

Now you understand what types of errors you’ll be facing, and how they are different. Operational errors are part of the runtime and application while programmer errors are bugs you introduce in your codebase.

Now you’re thinking, why do we divide them into two categories? It’s simple really.

Do you want to restart your app if there’s invalid DB query for a particular user due to not properly handled form validation and we pass a string instead of an integer to the DB query? Absolutely not. Other users are still enjoying your app. This is an example of an operational error.

What about failing to catch a rejected promise? Does it make sense to keep the app running even when a bug threatens your app? No! Restart it.


##### Handle Programming Errors
```js
// in /src/app.ts

import { terminate } from "./lib/errors/terminate.js";

const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
});

/* 
When a JavaScript error is not properly handled, 
an uncaughtException is emitted. This is for programmers errors like: 
- called an asynchronous function without a callback; 
- did not resolve a promise; 
- passed a string where an object was expected; 
- passed an object where a string was expected; 
- passed incorrect parameters in a function; 
*/
process.on("uncaughtException", exitHandler(1, "uncaughtException"));

/*
An unhandledRejection error is a newer concept. 
It is emitted when a promise is not satisfied; in other words, 
a promise was rejected (it failed), and there was no handler attached to respond. 
These errors can indicate an operational error or a programmer error, 
and they should also be treated as high priority.
*/
process.on("unhandledRejection", exitHandler(1, "unhandledRejection"));

/* 
Your operating system emits events to your Node.js process, 
too, depending on the circumstances occurring outside of your 
program. These are referred to as signals. Two of the more 
common signals are SIGTERM and SIGINT. 
*/

/* 
SIGTERM is normally sent by a process monitor to tell Node.js to 
expect a successful termination. If you're running systemd or upstart 
to manage your Node application, and you stop the service, it sends a 
SIGTERM event so that you can handle the process shutdown. 
*/
process.on("SIGTERM", exitHandler(0, "SIGTERM"));

/* 
SIGINT is emitted when a Node.js process is interrupted, usually as 
the result of a control-C (^-C) keyboard event. You can also capture 
that event and do some work around it. 
*/
process.on("SIGINT", exitHandler(0, "SIGINT"));
```

### Logging

For the logging we are using the [winston](https://www.npmjs.com/package//winston) logger and some custom made functions that wrap it.

There are two main functions to use the logger: [`logger`](#logger) and  [`setLoggerExtraInfo`](#setloggerextrainfo).

#### Logger
To print an operational error we will use the `logger.error(err)` function by passing the caught error.

```js
import { logger } from '/src/lib/logger/logger.ts'

try {
...
} catch (err: any) {
    logger.error(err);
    return res
        .status(500)
        .json({code: 500, message: "Your operational error message"});
}
```

This will only print the error but will not exit the app.

In case you want to let the default error handler to print the error just pass the error to the next(err) function. This way the error handler from the `/src/app.ts` file will print it and show the default operational errors message.

```js
try {
...
} catch (err: any) {
    return next(err);
}
```

#### SetLoggerExtraInfo
It adds additional custom properties and values to the error object and returns the modified error object.

For example in the Models we have a [getRaw()](#getraw-method) method that makes a query to the DB. If something happens like invalid DB query for example if we don't pass additional information to the logger all we will know will be that the query to the DB is invalid and that the [getRaw()](#getraw-method) funcion caused it, but we won't know what the query was and it might be hard to catch the same situation to debug it and we will have to guess what the problem might be.

For that purpose we could add the query string as additional information to the error, so we could debug later what exactly caused the problem. In this example we are only modifying the error object and it is not handled yet (error handling could be done from the top call stack function that called the model).

```js
import { setLoggerExtraInfo } from '/src/lib/logger/logger.ts';

...
} catch(err: any) {
    throw setLoggerExtraInfo(err, {
        functionName: "findById()",
        query: JSON.stringify(query),
    });
}
```



If we don't use the setLoggerExtraInfo() and throw the error directly, we will get the following information.
```js
try {
    // The invalid part of the query is that the blog posts column ID is of type BIGINT and we are passing a string "H" instead of a number.
    let blogPost = await new Blog().getRaw("SELECT * FROM posts WHERE id='H'");
} catch (err: any) {
    logger.error(err);
    throw err;
}

// the above error handling will print the following error
2022-10-07T12:30:59.716Z [ERROR CAUGHT] error:
 Error: error: invalid input syntax for type bigint: "H"
    at queryDb (file:///home/iliyan/projects/laravel-framework/dist/lib/db/postgresql/pool/pool.js:29:15)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Blog.getRaw (file:///home/iliyan/projects/laravel-framework/dist/models/main/Main.js:355:20)
    at async archive (file:///home/iliyan/projects/laravel-framework/dist/controllers/BlogController.js:8:24)
```

It will be much easier to debug if we add some additional information to the error like the query and function name for example.
```diff
try {
    // The invalid part of the query is that the blog posts column ID is of type BIGINT and we are passing a string "H" instead of a number.
    let blogPost = await new Blog().getRaw("SELECT * FROM posts WHERE id='H'");
} catch (err: any) {
+    let err = setLoggerExtraInfo(err, {
+        functionName: "findById()",
+        query: JSON.stringify(query),
+    });
     logger.error(err);
     throw err;
}

// the above error handling will print the following error
2022-10-07T12:37:08.500Z [ERROR CAUGHT] error:
 Error: error: invalid input syntax for type bigint: "H"
    at queryDb (file:///home/iliyan/projects/laravel-framework/dist/lib/db/postgresql/pool/pool.js:29:15)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Blog.getRaw (file:///home/iliyan/projects/laravel-framework/dist/models/main/Main.js:355:20)
    at async archive (file:///home/iliyan/projects/laravel-framework/dist/controllers/BlogController.js:8:24)

+  extraInfo:{"functionName":"getRaw()","query":"\"SELECT * FROM posts WHERE id='H'\""}
```
You can see how easy ит is now to identify that the id column expects a number instead of guessing which column is that. It's not impossible without this helper but it's much easier and time saving.

Now that error object could be used again to add more extra information to it from another uptop call stack function.

```js
// pay attention how we are setting again a property with the same name 'functionName' that was set from the getRaw() method
...
} catch (err: any) {
    err = setLoggerExtraInfo(err, {
        functionName: "archive()",
        someOtherName: 'random'
    });

    logger.error(err);
	// pass the error to the default error handler in the '/src/app.ts'
    return next(err);
}


2022-10-07T12:55:56.150Z [ERROR CAUGHT] error:
 Error: error: invalid input syntax for type bigint: "H"
    at queryDb (file:///home/iliyan/projects/laravel-framework/dist/lib/db/postgresql/pool/pool.js:29:15)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Blog.getRaw (file:///home/iliyan/projects/laravel-framework/dist/models/main/Main.js:355:20)
    at async archive (file:///home/iliyan/projects/laravel-framework/dist/controllers/BlogController.js:9:24)

extraInfo:{"functionName":"getRaw()","query":"\"SELECT * FROM posts WHERE id='H'\"","functionName-copy-583":"archive()","someOtherName":"random"}
```
You can see that the previous error is extended with the `someOtherName` and `functionName-copy-583` and that the first property `functionName` is not overridden from the second time we have set it. Instead a copy of its name with the corresponding value is added to the error.
