import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { CreatePostRequest } from '@posts/dto/create-post/request.dto';
import { UpdatePostRequest } from '@posts/dto/update-post/request.dto';

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
    orderBy
  }: {
    language: string;
    page: number;
    pageSize: number;
    order: string;
    orderBy: string;
  }) {
    const offset = page * pageSize;
    const limit = pageSize;

    if (!['desc', 'asc'].includes(order)) throw new BadRequestException();

    if (!['created_at', 'title'].includes(orderBy))
      throw new BadRequestException();

    return await this.postRepository.findAndCountAll({
      where: { language },
      order: [[orderBy, order.toUpperCase()]],
      limit,
      offset
    });
  }

  async searchPosts({
    searchString,
    language
  }: {
    searchString: string;
    language: string;
  }) {
    //
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
