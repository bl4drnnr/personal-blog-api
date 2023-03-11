import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { CreatePostRequest } from '@posts/dto/create-post/request.dto';
import { UpdatePostRequest } from '@posts/dto/update-post/request.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post) {}

  async getPostBySlug({ slug }: { slug: string }) {
    return await this.postRepository.findOne({
      where: { slug }
    });
  }

  async getPostById({ id }: { id: string }) {
    return await this.postRepository.findByPk(id);
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
