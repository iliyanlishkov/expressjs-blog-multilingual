import { UserAccessTokenObject } from "../../lib/auth/jwt/issueJWTTypes.js";
import jwt from "jsonwebtoken";

interface decodedJWT extends jwt.JwtPayload {
	user: UserAccessTokenObject;
}

export { decodedJWT };
