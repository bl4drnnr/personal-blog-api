import { IPicture } from '@interfaces/picture.interface';
import { IList } from '@interfaces/list.interface';
import { ICode } from '@interfaces/code.interface';
import { ITitle } from '@interfaces/title.interface';
import { ITechStack } from '@interfaces/tech-stack.interface';
import { IProjectPage } from '@interfaces/project-page.interface';

export class UpdateProjectDto {
  readonly title?: string;
  readonly slug?: string;
  readonly brief?: string;
  readonly description?: string;
  readonly tags?: string;
  readonly projectTags?: Array<string>;
  readonly briefDescription?: string;
  readonly license?: string;
  readonly techStack?: Array<ITechStack>;
  readonly projectPages?: Array<IProjectPage>;
  readonly toc?: object;
  readonly content?: Array<string | IPicture | IList | ICode | ITitle>;
}
