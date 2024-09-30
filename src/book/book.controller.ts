/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { createBookDto } from './dto/create-book.dto';
import { updateBookDto } from './dto/update-book.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}
  private readonly logger = new Logger(BookService.name);
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.debug('Called every 10 seconds');
  }
  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }
  @Interval(5000) // Executes every 5 seconds
  handleInterval() {
    console.log('Interval job running every 5 seconds');
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findAll(): Promise<Book[]> {
    return await this.bookService.findAll();
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download book by id in Excel Format' })
  async generateExcelWithId(@Param('id') id: string, @Res() res: Response) {
    try {
      const book = await this.bookService.getBookById(id);
      console.log('Books retrieved for PDF:', book);
      if (!book) {
        return res.status(404).send('Book not found');
      }

      const excelBuffer = await this.bookService.generateExcelWithId(book);

      res.set({
        'Content-Type': process.env.EXCEL_CONTENT_TYPE,
        'Content-Disposition': process.env.EXCEL_CONTENT_DISPOSITION,
      });

      res.send(excelBuffer);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).send('Failed to generate PDF');
    }
  }

  @Get('download')
  @ApiOperation({ summary: 'Download All books in PDF Format' })
  async generateAllBooksPDF(@Res() res: Response) {
    try {
      const books = await this.bookService.findAll();
      console.log('Books retrieved for PDF:', books);
      if (!books.length) {
        return res.status(404).send('No books found.');
      }

      const pdfBuffer = await this.bookService.generateAllBooksPDF(books);

      res.set({
        'Content-Type': process.env.PDF_CONTENT_TYPE,
        'Content-Disposition': process.env.PDF_CONTENT_DISPOSITION,
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).send('Failed to generate PDF');
    }
  }

  @Post()
  @ApiOperation({ summary: 'create book' })
  @ApiResponse({ status: 200, description: 'Book create' })
  @ApiResponse({ status: 404, description: 'unable to create' })
  async createBook(@Body() book: createBookDto): Promise<Book> {
    return this.bookService.createBook(book);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'delete book by id' })
  @ApiResponse({ status: 200, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async deleteBook(@Param('id') id: string) {
    console.log(id);
    return await this.bookService.deleteBook(id);
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
    return this.bookService.updateBookById(id, book);
  }
}
