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
}
