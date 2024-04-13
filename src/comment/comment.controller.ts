import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    Param,
    Delete,
    UseGuards,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { Role } from "../auth/schemas/auth.schema";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { Comment } from "./schemas/comment.schema";
import { RolesGuard } from "../auth/roles.guard";
import { BlogService } from "../blog/blog.service";
import { CommentService } from "./comment.service";

@Controller("comment")
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private blogService: BlogService
    ) {}

    @Post(":postId")
    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Guest)
    async createComment(
        @Param("postId") postId: string,
        @Request() req,
        @Body("content") content: string
    ): Promise<Comment> {
        const author = req.user._id;
        const post = await this.blogService.getPostById(postId);
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return this.commentService.createComment(postId, author, content);
    }

    @Public()
    @Get(":postId")
    async getPostComments(
        @Param("postId") postId: string
    ): Promise<Commennt[]> {
        return this.commentService.getPostComments(postId);
    }

    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Guest)
    async deleteComment(@Param("id") id: string, @Request req) {
        const comment = await this.commentService.getCommentById(id);
        if (!comment) {
            throw new NotFoundException(`Comment post with ID ${id} not found`);
        }
        const user = req.user;

        if (
            comment.author.toString() !== user._id.toString() &&
            user.role !== "admin"
        ) {
            throw new UnauthorizedException(
                `You are not authorized to delete this post`
            );
        }
        await this.commentService.deleteComment(id);
        return { message: `Blog post with ID ${id} deleted successfully` };
    }
}
