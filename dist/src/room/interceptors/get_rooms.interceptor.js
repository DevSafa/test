"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoomsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let GetRoomsInterceptor = class GetRoomsInterceptor {
    intercept(context, next) {
        return next
            .handle()
            .pipe((0, rxjs_1.map)((items) => items.map(item => {
            return ({
                id: item.id,
                user_role: item.user_role,
                room_id: item.room_id,
                type: item.room.type
            });
        })));
    }
};
GetRoomsInterceptor = __decorate([
    (0, common_1.Injectable)()
], GetRoomsInterceptor);
exports.GetRoomsInterceptor = GetRoomsInterceptor;
//# sourceMappingURL=get_rooms.interceptor.js.map