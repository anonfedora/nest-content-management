import { Prop, Schema, SchemaFactory } from "nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema
export class Product {
  @Prop()
  name: string;
  
  @Prop()
  description: string;
  
  @Prop()
  price: string;
  
  @Prop()
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);