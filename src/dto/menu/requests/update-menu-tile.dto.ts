import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuTileDto } from './create-menu-tile.dto';

export class UpdateMenuTileDto extends PartialType(CreateMenuTileDto) {}
