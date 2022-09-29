"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dto_changePass = exports.dto_join_room = exports.dto_kick = exports.dto_ban_mute = exports.dto_admin = exports.dm_msg = exports.dto_block = exports.dto_invite = exports.dto_global = exports.dto_user_room = exports.dto_msg = exports.dm_room = exports.room_name = exports.createRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class createRoomDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ required: true, description: "this input used  to add  room name" }),
    __metadata("design:type", String)
], createRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: "this input used  to add  room type if it's private, protected or public" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createRoomDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ required: true, description: "this input used  to add password room of the protected rooms" }),
    __metadata("design:type", String)
], createRoomDto.prototype, "password", void 0);
exports.createRoomDto = createRoomDto;
class room_name {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], room_name.prototype, "room_id", void 0);
exports.room_name = room_name;
class dm_room {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], dm_room.prototype, "to", void 0);
exports.dm_room = dm_room;
class dto_msg {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], dto_msg.prototype, "msg", void 0);
exports.dto_msg = dto_msg;
class dto_user_room {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_user_room.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_user_room.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], dto_user_room.prototype, "msg", void 0);
exports.dto_user_room = dto_user_room;
class dto_global {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_global.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_global.prototype, "to", void 0);
exports.dto_global = dto_global;
class dto_invite {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_invite.prototype, "user_to_invite", void 0);
exports.dto_invite = dto_invite;
class dto_block {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_block.prototype, "user_to_block", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_block.prototype, "room_id", void 0);
exports.dto_block = dto_block;
class dm_msg {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], dm_msg.prototype, "msg", void 0);
exports.dm_msg = dm_msg;
class dto_admin {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_admin.prototype, "new_admin", void 0);
exports.dto_admin = dto_admin;
class dto_ban_mute {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_ban_mute.prototype, "who", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], dto_ban_mute.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], dto_ban_mute.prototype, "type", void 0);
exports.dto_ban_mute = dto_ban_mute;
class dto_kick {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_kick.prototype, "who", void 0);
exports.dto_kick = dto_kick;
class dto_join_room {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_join_room.prototype, "room", void 0);
exports.dto_join_room = dto_join_room;
class dto_changePass {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], dto_changePass.prototype, "new_password", void 0);
exports.dto_changePass = dto_changePass;
//# sourceMappingURL=create-room.dto.js.map