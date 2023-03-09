import { ICode, ILink, IList, IPicture, ITitle } from '@models/post.model';

export class CreatePostDto {
  readonly title: string;
  readonly slug: string;
  readonly tags: string;
  readonly type: Array<string>;
  readonly description: string;
  readonly pageDescription: string;
  readonly intro: string;
  readonly timestamp: string;
  readonly footer?: string;
  readonly toc: object;
  readonly content: Array<string | IPicture | IList | ICode | ITitle>;
  readonly references: Array<ILink>;
}
