import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
    @Prop({ required: true , unique: true})
    name: string;

    @Prop({ required: true, type: User })
    author: User;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
