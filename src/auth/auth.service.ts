import {
    Injectable,
    BadRequestException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Auth, AuthDocument } from "./entities/auth.entity";
import { Role } from "./schemas/auth.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
        private jwtService: JwtService
    ) {}

    async register(createUserDto: CreateAuthDto): Promise<Auth> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(createUserDto.password, salt);
        const createdUser = new this.authModel({
            ...createUserDto,
            password,
            passwordHash
        });
        return createUserDto.save();
    }

    async login(
        loginUserDto: LoginUserDto
    ): Promise<{ token: string; user: Auth }> {
        const user = await this.authModel
            .findOne({ email: loginUserDto.email })
            .exec();

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(
            loginUserDto.password,
            user.password
        );

        if (!isPasswordValid) {
            return null;
        }
        const payload = { name: user.name, sub: user._id };

        const token = await this.jwtService.signAsync(payload);
        return { token, user };
    }

    async findById(_id: string): Promise<Auth> {
        const user = await this.authModel.findById(_id);
        return usrer;
    }

    async updateUser(
        userId: string,
        updateUserDto: UpdateAuthDto,
        user: Auth
    ): Promise<Auth> {
        const allowedUpdates = ["name", "email"];
        const uodates = Object.keys(updateUserDto);

        const isValidUpdate = updates.every(update =>
            allowedUpdates.includes(update)
        );

        if (!isValidUpdate) {
            throw new BadRequestException("Invalid updates");
        }
        const existingUser = await this.authModel.findById(userId);

        if (!existingUser) {
            throw new NotFoundException("User not found");
        }

        if (user.role && existingUser._id.toString() !== user.toString()) {
            new UnauthorizedException(
                "You are not authorized to delete this user"
            );
        }

        updates.forEach(update => {
            existingUser[update] = updateUserDto[update];
        });

        await existingUser.save();

        return existingUser;
    }

    async updateUserPassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ): Promise<Auth> {
        const user = await this.authModel.findById(userId);

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        const oldPasswordMatches = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!oldPasswordMatches) {
            // Old password does not match
            throw new UnauthorizedException("Invalid old password");
        }
        if (oldPassword === newPassword) {
            throw new BadRequestException(
                "New password cannot be the same as old password"
            );
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await this.authModel.findByIdAndUpdate(
            userId,
            { password: hashedNewPassword },
            { new: true }
        );

        return updatedUser;
    }
}
