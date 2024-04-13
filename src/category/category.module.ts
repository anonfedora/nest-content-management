import { Module } from "@nestjs/common";
import { CategorySchema } from "./schemas/category.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Category", schema: CategorySchema }
        ])
    ],
    providers: [CategoryService],
    controllers: [CategoryController]
})
export class CategoryModule {}
