"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntraStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
class IntraStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, "42") {
    constructor() {
        super({
            clientID: process.env.UID,
            clientSecret: process.env.SECRET,
            callbackURL: process.env.CALLBACKURL,
        });
    }
    async validate(accessToken, refreshToken, profile) {
        console.log("Strategy");
        const { username, displayName, photos, emails } = profile;
        const user = {
            login: username,
            fullName: displayName,
            picture: photos[0].value,
            email: emails[0].value,
            accessToken: accessToken
        };
        return user;
    }
}
exports.IntraStrategy = IntraStrategy;
//# sourceMappingURL=intra.strategy.js.map