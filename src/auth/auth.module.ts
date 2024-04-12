import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./constants";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "./roles.guard";
import { Auth, AuthSchema } from "./entities/auth.entity";
import * as dotenv from "dotenv";
dotenv.config();

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRING_DATE }
        })
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    controllers: [AuthController]
})
export class AuthModule {}
