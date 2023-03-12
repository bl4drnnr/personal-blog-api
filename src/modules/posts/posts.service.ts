import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { CreatePostRequest } from '@posts/dto/create-post/request.dto';
import { UpdatePostRequest } from '@posts/dto/update-post/request.dto';
import sequelize, { Op } from 'sequelize';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post) {}

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
    page: number;
    pageSize: number;
    order: string;
    orderBy: string;
    searchQuery: string;
    postTypes: string;
  }) {
    const offset = page * pageSize;
    const limit = pageSize;

    const orderByOptions = process.env.ORDER_BY_OPTIONS.split(',');
    const orderOptions = process.env.ORDER_OPTIONS.split(',');
    const postTypeOptions = process.env.POST_TYPE_OPTION.split(',');

    if (!orderByOptions.includes(orderBy) || !orderOptions.includes(order))
      throw new BadRequestException();

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
          throw new BadRequestException();
      });

      where['type'] = {
        [Op.contains]: postTypesArray
      };
    }

    return await this.postRepository.findAndCountAll({
      where: { language, ...where },
      order: [[order, orderBy]],
      limit,
      offset
    });
  }

  async createPost({ post }: { post: CreatePostRequest }) {
    return await this.postRepository.create(post);
  }

  async updatePost({ id, post }: { id: string; post: UpdatePostRequest }) {
    return await this.postRepository.update({ ...post }, { where: { id } });
  }

  async deletePost({ id }: { id: string }) {
    return await this.postRepository.destroy({ where: { id } });
  }
}
