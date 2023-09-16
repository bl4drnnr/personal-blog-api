import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import sequelize, { Op } from 'sequelize';
import { CreatePostDto } from '@dto/create-post.dto';
import { UpdatePostDto } from '@dto/update-post.dto';
import { ApiConfigService } from '@shared/config.service';
import { WrongOrderOptionException } from '@exceptions/wrong-order-option.exception';
import {PostUpdatedDto} from "@dto/post-updated.dto";

@Injectable()
export class PostsService {
  constructor(
    private readonly configService: ApiConfigService,
    @InjectModel(Post) private readonly postRepository: typeof Post
  ) {}

  async getPostBySlug({ slug, language }: { slug: string; language: string }) {
    return await this.postRepository.findOne({
      where: { slug, language }
    });
  }

  async getPostById({ id }: { id: string }) {
    return await this.postRepository.findByPk(id);
  }

  async getAllPosts({
    language,
    page,
    pageSize,
    order,
    orderBy,
    searchQuery,
    postTypes
  }: {
    language: string;
    page: string;
    pageSize: string;
    order: string;
    orderBy: string;
    searchQuery: string;
    postTypes: string;
  }) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const { orderByOptions, orderOptions, postTypeOptions } =
      this.configService.orderOptions;

    if (!orderByOptions.includes(orderBy) || !orderOptions.includes(order))
      throw new WrongOrderOptionException();

    const where = {};

    if (searchQuery) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${searchQuery}%`
          }
        },
        sequelize.where(
          sequelize.fn('array_to_string', sequelize.col('search_tags'), ','),
          'ILIKE',
          `%${searchQuery}%`
        )
      ];
    }

    if (postTypes) {
      const postTypesArray = postTypes.split(',');

      postTypesArray.forEach((postType) => {
        if (!postTypeOptions.includes(postType))
          throw new WrongOrderOptionException();
      });

      where['type'] = {
        [Op.contains]: postTypesArray
      };
    }

    const attributes = [
      'slug',
      'title',
      'description',
      'type',
      'searchTags',
      'createdAt'
    ];

    return await this.postRepository.findAndCountAll({
      where: { language, ...where },
      order: [[order, orderBy]],
      attributes,
      limit,
      offset
    });
  }

  async getAllSlugs() {
    const allSlugs = await this.postRepository.findAll({
      attributes: ['slug']
    });
    return allSlugs.map(({ slug }) => slug);
  }

  async createPost(post: CreatePostDto) {
    return await this.postRepository.create(post);
  }

  async updatePost({ id, post }: { id: string; post: UpdatePostDto }) {
    await this.postRepository.update({ ...post }, { where: { id } });

    return new PostUpdatedDto()
  }

  async deletePost({ id }: { id: string }) {
    return await this.postRepository.destroy({ where: { id } });
  }

  async getAvailableLanguages() {
    return this.configService.getAvailableLanguages;
  }
}
