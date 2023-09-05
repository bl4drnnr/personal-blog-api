import { Language } from '@enums/language.enum';
import { PostType } from '@enums/post-type.enum';
import { IPicture } from '@interfaces/picture.interface';
import { IList } from '@interfaces/list.interface';
import { ICode } from '@interfaces/code.interface';
import { ITitle } from '@interfaces/title.interface';
import { ILink } from '@interfaces/link.interface';

export class CreatePostDto {
  readonly language: Language;
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
