/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { createBookDto } from './dto/create-book.dto';
import { updateBookDto } from './dto/update-book.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.desorator';
import { User } from 'src/auth/schemas/user.schema';
import { TransformInterceptor } from 'src/transform.interceptor';

@ApiTags('book')
@UseGuards(AuthGuard('jwt'))
@Controller('book')
export class BookController {
  constructor(
    private bookService: BookService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  private readonly logger = new Logger(BookService.name);

  @Post('add-job')
  addJob(@Body('name') name: string, @Body('seconds') seconds: string) {
    this.bookService.addCronJob(name, seconds);
    return { message: `Job ${name} added successfully!` };
  }
  // @Post('add-job')
  // addJob(@Body('name') name: string, @Body('seconds') seconds: string) {
  //   this.bookService.addCronJob(name, seconds);
  //   return { message: `Job ${name} added successfully!` };
  // }

  @Delete('/cron/:name')
  deleteCron(@Param('name') name: string) {
    this.bookService.deleteCron(name);
    return { message: `Job ${name} deleted successfully!` };
  }
  @Get('job')
  getCrons() {
    return this.bookService.getCrons();
  }

  @Post('add-Interval')
  addInterval(
    @Body('name') name: string,
    @Body('milliseconds') milliseconds: number,
  ) {
    console.log(name, milliseconds);
    this.bookService.addInterval(name, milliseconds);
    return { message: `${name} created with ${milliseconds / 1000} seconds` };
  }

  @Delete('/interval/:name')
  deleteInterval(@Param('name') name: string) {
    this.bookService.deleteInterval(name);
  }
  @Get('get-Interval')
  getIntervals() {
    this.bookService.getIntervals();
  }

  @Post('add-Timeout')
  addTimeout(
    @Body('name') name: string,
    @Body('milliseconds') milliseconds: number,
  ) {
    this.bookService.addTimeout(name, milliseconds);
  }

  @Delete('/timeout/:name')
  deleteTimeout(@Param('name') name: string) {
    this.bookService.deleteTimeout(name);
  }
  @Get('/timeout')
  getTimeout() {
    this.bookService.getTimeout();
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @UseInterceptors(TransformInterceptor)
  async findAll(@GetUser() user: User): Promise<Book[]> {
    return await this.bookService.findAll(user);
  }

  @Get('download/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download book by id in Excel Format' })
  // async generateExcelWithId(@Param('id') id: string, @Res() res: Response) {
  //   try {
  //     const book = await this.bookService.getBookById(id);
  //     console.log('Books retrieved for Excel:', book);
  //     if (!book) {
  //       return res.status(404).send('Book not found');
  //     }

  //     const excelBuffer = await this.bookService.generateExcelWithId(book);

  //     res.set({
  //       'Content-Type': process.env.EXCEL_CONTENT_TYPE,
  //       'Content-Disposition': process.env.EXCEL_CONTENT_DISPOSITION,
  //     });

  //     res.send(excelBuffer);
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  //     res.status(500).send('Failed to generate PDF');
  //   }
  // }
  async generateExcelWithId(@Param('id') id: string, @Res() res: Response) {
    try {
      const book = await this.getBookById(id);
      if (!book) {
        res.status(404).send(`book with id ${id} is not found!`);
      } else {
        const excelBuffer = this.bookService.generateExcelWithId(book);
        res.set({
          'Content-Type': process.env.EXCEL_CONTENT_TYPE,
          'Content-Disposition': process.env.EXCEL_CONTENT_DISPOSITION,
        });
        res.status(200).send(excelBuffer);
      }
    } catch (err) {
      console.log('error dowloading : ', err);
      res.status(500).send('Failed to generate');
    }
  }

  @Get('download')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download All books in PDF Format' })
  // async generateAllBooksPDF(@Res() res: Response, @GetUser() user: User) {
  //   try {
  //     const books = await this.bookService.findAll(user);
  //     console.log('Books retrieved for PDF:', books);
  //     if (!books.length) {
  //       return res.status(404).send('No books found.');
  //     }

  //     const pdfBuffer = await this.bookService.generateAllBooksPDF(books);

  //     res.set({
  //       'Content-Type': process.env.PDF_CONTENT_TYPE,
  //       'Content-Disposition': process.env.PDF_CONTENT_DISPOSITION,
  //     });

  //     res.send(pdfBuffer);
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  //     res.status(500).send('Failed to generate PDF');
  //   }
  // }
  async generateAllBooksPDF(@Res() res: Response, @GetUser() user: User) {
    try {
      const books = await this.findAll(user);
      if (!books.length) {
        res.status(401).send(`no books found`);
      } else {
        const pdfBuffer = await this.bookService.generateAllBooksPDF(books);
        res.set({
          'Content-Type': process.env.PDF_CONTENT_TYPE,
          'Content-Disposition': process.env.PDF_CONTENT_DISPOSITION,
        });
        res.status(200).send(pdfBuffer);
      }
    } catch (err) {
      console.log('error dowliding PDF', err);
      res.status(500).send('Failed to generate ');
    }
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create book' })
  @ApiResponse({ status: 200, description: 'Book create' })
  @ApiResponse({ status: 404, description: 'unable to create' })
  async createBook(
    @Body() createBookDto: createBookDto,
    @GetUser() user: User,
  ): Promise<Book> {
    return this.bookService.createBook(createBookDto, user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete book by id' })
  @ApiResponse({ status: 200, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async deleteBook(@Param('id') id: string) {
    return await this.bookService.deleteBook(id);
  }
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update book by id' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async updateBookbyId(
    @Param('id')
    id: string,
    @Body() updateBookDto: updateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBookById(id, updateBookDto);
  }
}
