import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Request,
    UseGuards,
    Delete,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    HttpException,
    NotFoundException,
    UnauthorizedException,
    Req
} from "@nestjs/common";
import { Blog } from "./schemas/blog.schema";
import { Role } from "../auth/schemas/auth.schema";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { MongoError } from "mongodb";
import { RolesGuard } from "../auth/roles.guard";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { CommentService } from "../comment/comment.service";
import { FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller("blog")
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly commentService: CommentService
    ) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Guest)
    @UseInterceptors(FileInterceptor("imageUrl"))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createBlogDto: CreateBlogDto,
        @Request() req
    ): Promise<Blog> {
        try {
            createBlogDto.imageUrl = file.path;

            const savedBlogPost = await this.blogService.create(
                createBlogDto,
                req.user
            );
            savedBlogPost.imageUrl = `${req.protocol}://${req.get("host")}/${
                savedBlogPost.imageUrl
            }`;
            return savedBlogPost;
        } catch (e) {
            if (e instanceof MongoError && e.code === 11000) {
                throw new Error("Slug already exists");
            } else {
                throw e;
            }
        }
    }

    @Public()
    @Get()
    async getAll(@Query("page") page: number, @Query("limit") limit: number) {
        return this.blogService.findAll(page, limit);
    }
}
