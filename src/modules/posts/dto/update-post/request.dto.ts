import {
  ICode,
  ILink,
  IList,
  IPicture,
  ITitle,
  PostType
} from '@models/post.model';

export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  tags?: string;
  type?: Array<PostType>;
  description?: string;
  pageDescription?: string;
  searchTags?: Array<string>;
  intro?: string;
  footer?: string;
  toc?: object;
  content?: Array<string | IPicture | IList | ICode | ITitle>;
  references?: Array<ILink>;
}
