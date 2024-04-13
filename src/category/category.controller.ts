import {
    Controller,
    Req,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    HttpStatus,
    HttpException,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryService } from "./category.service";
import { RolesGuard } from "../auth/roles.guard";
import { Category } from "./schemas/category.schema";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/schemas/auth.schema";

@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Guest)
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Request() req
    ): Promise<Category> {
        return await this.categoryService.createCategory(
            createCategoryDto,
            req.user._id
        );
    }

    @Public()
    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Public()
    @Get(":id")
    async getCategory(@Param("id") id: string) {
        return this.categoryService.findOne(id);
    }

    @Public()
    @Patch(":id")
    async updateCategory(
        @Param("id") id: string,
        @Body() update: Partial<Category>
    ) {
        const category = await this.categoryService.updateCategory(id, update);
        return category;
    }

    @Public()
    @Delete(":id")
    async deleteCategory(@Param("id") id: string) {
        const category = await this.categoryService.deleteCategory(id);
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return { message: `Category with ID ${id} successfully deleted` };
    }
}
