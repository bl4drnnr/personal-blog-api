import { Injectable } from '@nestjs/common';
import { PostModel } from '@models/post.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePostInterface } from '@interfaces/create-post.interface';
import { PostCreatedDto } from '@dto/posts/response/post-created.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostModel)
    private readonly postRepository: typeof PostModel
  ) {}

  async createPost({ userId, payload, trx }: CreatePostInterface) {
    const { postName, postDescription, postTags, sections } = payload;

    const postSlug = this.generatePostSlug(postName);

    await this.postRepository.create(
      {
        postName,
        postSlug,
        postDescription,
        postTags,
        sections,
        userId
      },
      { transaction: trx }
    );

    return new PostCreatedDto();
  }

  private generatePostSlug(postName: string) {
    let slug = postName.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\w\-]+/g, '');

    const randomNumber = String((Date.now() + Math.random()) * 10000).slice(-6);

    slug += `-${randomNumber}`;

    return slug;
  }
}
