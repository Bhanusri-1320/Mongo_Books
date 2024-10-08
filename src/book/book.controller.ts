/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { createBookDto } from './dto/create-book.dto';
import { updateBookDto } from './dto/update-book.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private BookService: BookService) {}
  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findAll(): Promise<Book[]> {
    return await this.BookService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'create book' })
  @ApiResponse({ status: 200, description: 'Book create' })
  @ApiResponse({ status: 404, description: 'unable to create' })
  async createBook(@Body() book: createBookDto): Promise<Book> {
    return this.BookService.createBook(book);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookById(@Param('id') id: string) {
    return this.BookService.getBookById(id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'delete book by id' })
  @ApiResponse({ status: 200, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async deleteBook(@Param('id') id: string) {
    console.log(id);
    return await this.BookService.deleteBook(id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'update book by id' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async updateBookbyId(
    @Param('id')
    id: string,
    @Body() book: updateBookDto,
  ): Promise<Book> {
    return this.BookService.updateBookById(id, book);
  }
}
