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
import { AutoMap } from '@automapper/classes';
import { User } from 'src/auth/schemas/user.schema';
import { GetUser } from 'src/auth/get-user.desorator';
import { Expose } from 'class-transformer';

export class createBookDto {
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  @AutoMap()
  @Expose()
  readonly title: string;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  @AutoMap()
  @Expose()
  readonly description: string;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  @AutoMap()
  @Expose()
  readonly author: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @AutoMap()
  @Expose()
  readonly price: number;
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  @AutoMap()
  @Expose()
  readonly category: Category;

  @AutoMap()
  @Expose()
  user: User;
}
