import {
  ICode,
  IList,
  IPicture,
  IProjectPage,
  ITitle,
  ITechStack,
  LanguageType
} from '@models/project.model';

export interface CreateProjectRequest {
  language: LanguageType;
  title: string;
  slug: string;
  brief: string;
  tags: string;
  description: string;
  projectTags: Array<string>;
  briefDescription: string;
  license: string;
  techStack: Array<ITechStack>;
  projectPages: Array<IProjectPage>;
  toc: object;
  content: Array<string | IPicture | IList | ICode | ITitle>;
}
