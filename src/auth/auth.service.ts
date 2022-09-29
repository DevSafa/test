import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        ) {}
    async success(user: any) {
        const player = await this.prisma.user.findUnique({
            where: {
                login: user.login
            }
        });
        if (player) {
            const payload = {sub: player.login}
            console.log("Player Found");
            return {
                accessToken: this.jwtService.sign(payload),
                player_info: player
            };
        }
        else {
            console.log("Player Not Found");
            const check = await this.prisma.user.create({
                data: {
                    login: user.login,
                    username: user.login,
                    avatar: user.picture,
                    email: user.email
                }
            });
            const payload = {sub: check.login}
            console.log("Check", check);
            return {
                accessToken: this.jwtService.sign(payload),
                player_info: check
            };
        }
    }
}
