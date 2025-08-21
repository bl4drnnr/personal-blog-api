import { PartialType } from '@nestjs/mapped-types';
import { CreateNotFoundPageDto } from './create-not-found-page.dto';

export class UpdateNotFoundPageDto extends PartialType(CreateNotFoundPageDto) {}
