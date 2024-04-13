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

    @Public()
    @Get("featured")
    async getFeaturedPosts(): Promise<Blog[]> {
        return this.blogService.findFeaturedPosts();
    }

    @Public()
    @Get(":id/:category/:slug")
    async getPostByIdCategoryAndSlug(
        @Param("id") id: string,
        @Param("category") category: string,
        @Param("slug") slug: string
    ): Promise<Blog> {
        const post = await this.blogService.findByIdCategoryAndSlug(
            id,
            category,
            slug
        );
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return post;
    }

    @Get(":id/similar")
    async findSimilarBlogs(@Param("id") id: string): Promise<Blog[]> {
        const blog = await this.blogService.getPostById(id);
        if (!blog) {
            throw new NotFoundException("Blog not found");
        }
        const similarBlogs = await this.blogService.findSimilarBlogs(blog);
        return similarBlogs;
    }

    @Public()
    @Get("/author/:authorId")
    async getBlogsByAuthor(
        @Param("authorId") authorId: string
    ): Promise<Blog[]> {
        const blogs = await this.blogService.getBlogsByAuthor(authorId);
        return blogs;
    }

    @Public()
    @Get("category/:categoryName")
    async getBlogsByCategory(
        @Param("categoryName") categoryName: string
    ): Promise<Blog[]> {
        return this.blogService.findByIdCategory(categoryName);
    }

    @Public()
    @Get("tags")
    async getAllTags() {
        const tags = await this.blogService.getAllTags();
        const formattedTags = tags.map(tag => ({
            name: tag.name,
            count: tag.count
        }));
    }
}
