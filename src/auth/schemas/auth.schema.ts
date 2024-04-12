import { Prop, Schema, SchemaFactory } from "@nest/mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import { Document } from "mongoose";

export enum Role {
    Guest = "guest",
    SubAdmin = "sub_admin",
    Admin = "admin"
}

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    avatar: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: Role, default: Role.Guest })
    role: Role;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
