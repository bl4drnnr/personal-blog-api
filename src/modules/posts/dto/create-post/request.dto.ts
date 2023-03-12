import {
  ICode,
  ILink,
  IList,
  IPicture,
  ITitle,
  LanguageType,
  PostType
} from '@models/post.model';

export class CreatePostRequest {
  readonly language: LanguageType;
  readonly title: string;
  readonly slug: string;
  readonly tags: string;
  readonly type: Array<PostType>;
  readonly description: string;
  readonly pageDescription: string;
  readonly searchTags: Array<string>;
  readonly intro: string;
  readonly footer?: string;
  readonly toc: object;
  readonly content: Array<string | IPicture | IList | ICode | ITitle>;
  readonly references: Array<ILink>;
}
