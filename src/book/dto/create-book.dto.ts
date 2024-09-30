/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schemas/book.schema';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createBookDto {
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  readonly title: string;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  readonly description: string;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  readonly author: string;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsNumber()
  readonly price: number;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  readonly category: Category;
}
