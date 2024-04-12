import {
    Injectable,
    BadRequestException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {}
