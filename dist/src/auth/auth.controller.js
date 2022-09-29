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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const intra_guard_1 = require("./guards/intra.guard");
const intra_jwt_guard_1 = require("./guards/intra_jwt.guard");
const passport_1 = require("@nestjs/passport");
const http_exception_filter_1 = require("./filters/http-exception.filter");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(req) { }
    async success(req, res) {
        const player = await this.authService.success(req.user);
        res.cookie("Authorization", player.accessToken);
        res.cookie("login", player.player_info.login);
        res.cookie("avatar", player.player_info.avatar);
        res.cookie("username", player.player_info.username);
        res.redirect("http://localhost:3000");
    }
    test(req, res) {
        res.json({ User: req.user });
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("42")),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(intra_guard_1.IntraGuard),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Get)("success"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "success", null);
__decorate([
    (0, common_1.UseGuards)(intra_jwt_guard_1.IntraJwtGuard),
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map