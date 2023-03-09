import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '@models/post.model';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post) {}

  async getPostBySlug({ slug }: { slug: string }) {
    return await this.postRepository.findOne({
      where: { slug }
    });
  }
}
