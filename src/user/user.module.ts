import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "src/auth/schemas/auth.schema";
import { AuthService } from "src/auth/auth.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }])
    ],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
