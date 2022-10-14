import jwt from "jsonwebtoken";
import {
	refreshTokenCookieDefaultExp,
	accessTokenExp,
} from "../../../config/cookies/cookies.js";

import {
	UserAccessTokenObject,
	UserRefreshTokenObject,
} from "./issueJWTTypes.js";

const generateJWTAccessToken = (user: UserAccessTokenObject): string => {
	return jwt.sign(
		{ user: user },
		process.env.ACCESS_TOKEN_SECRET ||
			"752dd90e0824cda1b3da97842c13a8e3490071dc7efc9fa7e461c9329fad708231a6dac63276eadabd16e4892acf2423fc7d323ba30068bded0cc898c73a2dba",
		{
			expiresIn: `${accessTokenExp}ms`,
		}
	);
};

const generateJWTRefreshToken = (user: UserRefreshTokenObject): string => {
	return jwt.sign(
		{ user: user },
		process.env.REFRESH_TOKEN_SECRET ||
			"88f895879375g7537g597g59759g987598759gh9j79800kd03dk30d3e0dk309u08348757576-0123e01jehjd1093dk78y3ue38dj32j8ey2837dmdkjfdshfsfsdfds",
		{
			expiresIn: refreshTokenCookieDefaultExp,
		}
	);
};

export { generateJWTAccessToken, generateJWTRefreshToken };
