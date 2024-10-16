import { User } from 'src/auth/schemas/user.schema';
import { createBookDto } from './dto/create-book.dto';
import { Book } from './schemas/book.schema';

export class BookMapper {
  static createMapper(createBookDto: createBookDto): Book {
    const book = new Book();
    book.title = createBookDto.title;
    book.description = createBookDto.description;
    book.price = createBookDto.price;
    book.author = createBookDto.author;
    return book;
  }
}
