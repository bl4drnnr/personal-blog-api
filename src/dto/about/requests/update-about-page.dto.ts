import { PartialType } from '@nestjs/mapped-types';
import { CreateAboutPageDto } from './create-about-page.dto';

export class UpdateAboutPageDto extends PartialType(CreateAboutPageDto) {}
