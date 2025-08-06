import { IsArray, IsUUID } from 'class-validator';

export class ReorderContactTilesDto {
  @IsArray()
  @IsUUID(4, { each: true })
  tileIds: string[];
}
