import {
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { Model } from "mongoose";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import { InjectModel } from "@nestjs/mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment, CommentSchema } from "./schemas/comment.schema";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: Model<Comment>
    ) {}

    async creatComment(
        postId: string,
        author: string,
        content: string
    ): Promise<Comment> {
        const newComment = new this.commentModel({
            author,
            content,
            postId
        });
        return newComment.save();
    }

    async getCommentById(id: string): Promise<Comment> {
        return this.commentModel.findById(id);
    }

    async getPostComments(postId: string): Promise<Comment[]> {
        const comments = await this.commentModel.find({
            post: postId
        });
        if (!commnts || commnts.length === 0) {
            throw new NotFoundException("Comments not found");
        }
        return comments;
    }

    async deleteComment(commentId: string): Promise<void> {
        return this.commentModel.findByIdAndDelete(commentId);
    }

    async deleteManyByPostId(commentId: string) {
        return this.commentModel.deleteMany({ post: postId });
    }
}
