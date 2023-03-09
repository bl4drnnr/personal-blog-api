import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';
import { CreatePostDto } from '@posts/dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post) {}

  async getPostBySlug({ slug }: { slug: string }) {
    return await this.postRepository.findOne({
      where: { slug }
    });
  }

  async createPost({ post }: { post: CreatePostDto }) {
    return await this.postRepository.create(post);
  }
}
