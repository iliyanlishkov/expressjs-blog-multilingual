import { getNamedRouteUrl } from "../../lib/route/getNamedRouteUrl/getNamedRouteUrl.js";

export const authFailedRedirectUrl = (locale: string): string => {
	// it returns http://localhost:3000/login but you can return any other url by your choice
	return getNamedRouteUrl(locale + "_get_login_.index");

	// return "https://www.example.com/login"
}