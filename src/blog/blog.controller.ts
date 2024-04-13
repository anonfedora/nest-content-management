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
    constructor(private readonly BlogService: BlogService) {}
}
