import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { BlogModule } from "../blog/blog.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
        forwardRef(() => BlogModule)
    ],
    providers: [CommentService],
    controllers: [CommentController],
    exports: [CommentService]
})
export class CommentModule {}
