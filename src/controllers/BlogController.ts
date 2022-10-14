import { setIsLoggedIn } from "../middleware/auth/auth.js";

import { Request, Response, NextFunction } from "express";

import { setLocale } from "../middleware/setLocale.js";
import { setPathToLocals } from "../middleware/locals/setPath.js";
import { Blog } from "../models/blog/Blog.js";
import { customAlternateUrlsParamsArr } from "../lib/helpers/localization/getAlternateLanguagesUrlsTypes.js";
import { res404 } from "../modules/errors/res404.js";

export const middleware = [setLocale, setPathToLocals, setIsLoggedIn]; // general middlewahre for all functions of ucrrent controller

export async function archive(req: Request, res: Response, next: NextFunction) {
	try {
		// let blogPost = await new Blog().getRaw("SELECT * FROM posts WHERE id='H'");

		let blogPosts = await new Blog(req, res) // we need to pass the req and res here only if we are using pagination
			.where("language", "=", req.locale as string)
			.orderBy("created_at", "desc")
			.paginate(2)
			.get();

		return res.render("pages/blog/archive", {
			blogPosts: blogPosts,
		});
	} catch (err) {
		return next(err);
	}
}

export async function singleBlogPost(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		let post = await new Blog()
			.where("language", "=", req.locale as string)
			.where("slug", "=", req.params.slug as string)
			.orderBy("created_at", "desc")
			.first();

		if (!post) {
			return res404(res);
		}

		let alternatePosts = await new Blog()
			.where("common_ids", "=", post.common_ids.toString())
			.get(["language", "slug"]);

		if (!alternatePosts) {
			return res404(res);
		}

		let alternates: customAlternateUrlsParamsArr = [];

		alternatePosts.map((x) => {
			return alternates.push({
				language: x.language,
				parameters: [x.slug],
			});
		});

		res.locals.alternates = alternates;

		return res.render("pages/blog/singleBlogPost", {
			post: post,
		});
	} catch (err) {
		return next(err);
	}
}
