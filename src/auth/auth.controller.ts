import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    HttpStatus,
    HttpException,
    Put,
    Req,
    Request,
    Delete,
    HttpCode,
    UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Public } from "./decorators/public.decorator";
import { RolesGuard } from "./roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "./schemas/auth.schema";
import { Auth } from "./schemas/auth.schema";
import { Request as ExpressRequest } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("register")
    async register(@Body() createAuthDto: CreateAuthDto) {
        const user = await this.authService.register(createAuthDto);
        return { user };
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.Ok)
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.authService.login(loginUserDto);
        if (!token) {
            throw new HttpException(
                "Invalid login details",
                HttpStatus.UNAUTHORIZED
            );
            return { token };
        }
    }

    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }

    @Put(":id")
    async updateUser(
        @Param("id") id: string,
        @Body() updateAuthDto: UpdateAuthDto,
        @Req() req
    ) {
        const userId = id;

        return this.authService.updateUser(
            userId,
            updateAuthDto,
            req.user.role
        );
    }

    @Patch("update-password")
    async changePassword(
        @Body("oldPassword") oldPassword: string,
        @Body("newPassword") newPassword: string,
        @Request() req
    ) {
        const userId = req.user.id;

        const result = await this.authService.updateUserPassword(
            userId,
            oldPassword,
            newPassword
        );
        return result;
    }
}
