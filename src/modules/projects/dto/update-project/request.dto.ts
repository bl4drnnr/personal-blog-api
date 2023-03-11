import {
  ICode,
  IList,
  IPicture,
  IProjectPage,
  ITitle,
  ITechStack
} from '@models/project.model';

export interface UpdateProjectRequest {
  title?: string;
  slug?: string;
  brief?: string;
  description?: string;
  tags?: string;
  searchTags?: Array<string>;
  briefDescription?: string;
  license?: string;
  techStack?: Array<ITechStack>;
  projectPages?: Array<IProjectPage>;
  toc?: object;
  content?: Array<string | IPicture | IList | ICode | ITitle>;
}
