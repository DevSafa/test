"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsUser = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let FriendsUser = class FriendsUser {
    intercept(context, next) {
        return next
            .handle()
            .pipe((0, rxjs_1.map)(items => items.map(item => {
            return ({
                id: item.id,
                login: item.user2.login,
                username: item.user2.username,
                avatar: item.user2.avatar,
            });
        })));
    }
};
FriendsUser = __decorate([
    (0, common_1.Injectable)()
], FriendsUser);
exports.FriendsUser = FriendsUser;
//# sourceMappingURL=friends_user.interceptor.js.map