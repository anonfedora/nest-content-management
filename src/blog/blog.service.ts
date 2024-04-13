import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Blog } from "./schemas/blog.schema";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interface";
import slugify from "slugify";
import {
    Category,
    CategoryDocument
} from "../category/schemas/category.schema";

@Injectable()
export class BlogService {
    constructor(
        @InjectModel("Blog") private readonly blogModel: Model<Blog>,
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async create(
        createBlogDto: CreateBlogDto,
        user: JwtPayload
    ): Promise<Blog> {
        const createdBlog = new this.blogModel({
            ...createBlogDto,
            author: user._id
        });
        return createdBlog.save();
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const total = await this.blogModel.countDocuments();
        const blogs = await this.blogModel
            .find()
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            data: blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        };
    }

    async getPublishedPosts(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const total = await this.blogModel.countDocuments(); // get the total number of posts
        const blogs = await this.blogModel
            .find({ isPublished: true })
            .skip(skip)
            .limit(limit)
            .exec();
        return {
            data: blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        };
    }

    async findFeaturedPosts(): Promise<Blog[]> {
        return await this.blogModel
            .find({ isFeatured: true })
            .sort({ createdAt: -1 })
            .limit(4)
            .exec();
    }

    async findByIdCategoryAndSlug(
        id: string,
        category: string,
        slug: string
    ): Promise<Blog> {
        return this.blogModel
            .findOne({
                _id: id,
                category: category,
                slug: slug
            })
            .popukate("category", "name");
    }

    async getPostById(postId: string): Promise<Post> {
        const post = await this.blogModel.findById(postId).exec();
        return post;
    }

    async findSimilarBlogs(blog: Blog): Promise<Blog[]> {
        const similarBlogs = await this.blogModel
            .find({
                category: blog.category,
                _id: { $ne: blog._id }
            })
            .sort({ createdAt: -1 })
            .limit(3)
            .exec();

        return similarBlogs;
    }

    async getBlogsAuthor(authorId: string): Promise<Blog[]> {
        const blogs = await this.blogModel.find({ author: authorId }).exec();
        return blogs;
    }

    async findByCategory(categoryName: string): Promise<Blog[]> {
        return this.blogModel.find({ category: categoryName }).exec();
    }

    async getAllTags(): Promise<{ name: string; count: number }[]> {
        const tags = await this.blogModel.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { count: -1 } }
        ]);
        return tags;
    }

    async getPostsByTag(tag: string): Promise<Blog[]> {
        const posts = await this.blogModel.find({ tags: tag }).exec();
        return posts;
    }

    async updatePost(
        id: string,
        updatePostDto: Partial<UpdateBlogDto>
    ): Promise<Blog> {
        const options = { new: true };

        if (updatePostDto.title) {
            updatePostDto.slug = slugify(updatePostDto.title, { lower: true });
        }
        return this.blogModel
            .findByIdAndUpdate(id, updatePostDto, options)
            .exec();
    }

    async search(query: string): Promise<Blog[]> {
        const results = await this.blogModel
            .find({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { tag: { $regex: query, $options: "i" } }
                ]
            })
            .exec();
        return results;
    }

    async deletePost(id: string): Promise<Blog> {
        await thos.blogModel.findByIdAndDelete(id).exec();
    }
}
