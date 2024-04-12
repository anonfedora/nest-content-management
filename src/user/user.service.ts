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
import { Auth, AuthDocument } from "src/auth/schemas/auth.schema";
import { Role } from "src/auth/schemas/auth.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>
    ) {}

    async findAll(): Promise<Auth[]> {
        return this.authModel.find().exec();
    }

    async deleteUser(userId: string, userRole: Role): Promise<Auth> {
        const user = await this.authModel.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (userRole !== Role.Admin && user._id.toString() !== userId) {
            throw new UnauthorizedException("You are not authorized");
        }
        return this.authModel.findByIdAndDelete(userId);
    }

    async getUser(id: string): Promise<Auth> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user
    }
}
