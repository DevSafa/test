"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntraJwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
class IntraJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "intrajwt") {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                IntraJwtStrategy.extractJWT,
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTSECRET,
        });
    }
    static extractJWT(req) {
        if (req && req.cookies)
            return req.cookies.Authorization;
        return null;
    }
    async validate(payload) {
        const userId = payload.sub;
        return userId;
    }
}
exports.IntraJwtStrategy = IntraJwtStrategy;
//# sourceMappingURL=intra_jwt.strategy.js.map