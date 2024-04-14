import { Module, forwardRef } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { BlogSchema } from "./schemas/blog.schema";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { diskStorage } from "multer";
import { extname } from "path";
import { CommentModule } from "../comment/comment.module";
import { Category, CategorySchema } from "../category/schemas/category.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Blog", schema: BlogSchema },
            { name: Category.name, schema: CategorySchema }
        ]),
        forwardRef(() => CommentModule),
        MulterModule.register({
            storage: diskStorage({
                destination: "./uploads/blog",
                filename: (req, file, callback) => {
                    const name = file.originalname.split(".")[0];
                    const fileExtName = extname(file.originalname);
                    const randomName = Array(4)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join("");
                    callback(null, `${name}-${randomName}${fileExtName}`);
                }
            })
        })
    ],
    providers: [BlogService],
    controllers: [BlogController],
    exports: [BlogService]
})
export class BlogModule {}
