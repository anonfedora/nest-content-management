import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { Blog } from "../../blog/schemas/blog.schema";
import { User } from "../../user/schemas/user.schema";

@schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: User, required: true })
    author: User;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    post: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
