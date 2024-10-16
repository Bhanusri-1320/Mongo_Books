/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema({
  timestamps: true, // enables automatic createdAt updateAt time stamps
})
export class Book {
  @Prop() // can add validations and defining a property in schema
  @AutoMap()
  title: string;

  @Prop()
  @AutoMap()
  description: string;

  @Prop() // can add validations
  @AutoMap()
  author: string;

  @Prop()
  @AutoMap()
  price: number;

  @Prop()
  @AutoMap()
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @AutoMap()
  user: mongoose.Schema.Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book); // Automatically generating a Mongoose schema based on your class definition.
