import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {IntraStrategy} from "./strategies/intra.strategy";
import {JwtModule} from "@nestjs/jwt";
import { IntraJwtStrategy } from './strategies/intra_jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWTSECRET,
            signOptions: {
                expiresIn: "1d"
            }
        }),
    ],
    providers: [
      AuthService,
      IntraStrategy,
        IntraJwtStrategy
    ],
    controllers: [AuthController]
})
export class AuthModule {}
