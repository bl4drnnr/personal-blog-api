import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuPageDto } from './create-menu-page.dto';

export class UpdateMenuPageDto extends PartialType(CreateMenuPageDto) {}
