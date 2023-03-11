import { ICode, ILink, IList, IPicture, ITitle } from '@models/post.model';

export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  tags?: string;
  type?: Array<string>;
  description?: string;
  pageDescription?: string;
  searchTags?: Array<string>;
  intro?: string;
  timestamp?: string;
  footer?: string;
  toc?: object;
  content?: Array<string | IPicture | IList | ICode | ITitle>;
  references?: Array<ILink>;
}
