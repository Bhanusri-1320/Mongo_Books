/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Book, Category } from './schemas/book.schema';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';
import { CronJob } from 'cron';
import { createBookDto } from './dto/create-book.dto';
import { updateBookDto } from './dto/update-book.dto';
import { BookMapper } from './book.mapper';
import { mapper } from './mappers/mapper';
import { User } from 'src/auth/schemas/user.schema';
import { title } from 'process';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  // info, error, warning
  private readonly logger = new Logger(BookService.name); // if we don't provide the bookserive.name it will don't mention it in the console

  // @Cron('10 * * * * *', {
  //   name: 'notification',
  //   timeZone: 'Asia/Kolkata',
  //   disabled: true, // true--> not print , false--> will execute
  // })
  // triggerNotifications() {
  //   console.log('you have a notification !!');
  // }
  // @Cron(CronExpression.EVERY_30_SECONDS)
  // handleCron() {
  //   this.logger.debug('Called every 30 seconds');
  // }
  // // @Timeout(20000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 20 seconds');
  //   const job = this.schedulerRegistry.getCronJob('notifications');
  //   job.stop(); // Stop the job
  //   this.logger.log(`Job stopped. Last run date: ${job.lastDate()}`);
  // }
  // @Interval(5000) // Executes every 5 seconds
  // handleInterval() {
  //   console.log('Interval job running every 5 seconds');
  // }
  // @Cron('4 * * * * *', {
  //   name: 'notifications',
  //   timeZone: 'Europe/Paris',
  // })
  // triggerNotifications() {
  //   console.log('notification');
  // }
  //Create a new cron job dynamically
  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`for every ${seconds}`);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.warn('creation is completed');
  }

  // addCronJob(name: string, seconds: string) {
  //   const job = new CronJob(`${seconds} * * * * *`, () => {
  //     this.logger.warn(`time (${seconds}) for job ${name} to run!`);
  //   });

  //   this.schedulerRegistry.addCronJob(name, job);
  //   job.start();

  //   this.logger.warn(
  //     `job ${name} added for each minute at ${seconds} seconds!`,
  //   );
  // }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`${name} deletion successfull!`);
  }
  // deleteCron(name: string) {
  //   this.schedulerRegistry.deleteCronJob(name);
  //   this.logger.warn(`job ${name} deleted!`);
  // }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDate().toJSDate();
      } catch {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} - > next: ${next}`);
    });
  }
  // getCrons() {
  //   const jobs = this.schedulerRegistry.getCronJobs();
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   jobs.forEach((value, key, map) => {
  //     let next;
  //     try {
  //       next = value.nextDate().toJSDate();
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     } catch (e) {
  //       next = 'error: next fire date is in the past!';
  //     }
  //     this.logger.log(`job: ${key} -> next: ${next}`); // key-->name, next=> JS Date
  //   });
  // }

  // Create a new interval dynamically
  addInterval(name: string, milliSeconds: number) {
    const callback = () => {
      this.logger.warn(`Interval ${name} executing at time ${milliSeconds}!`);
    };
    const Interval = setInterval(callback, milliSeconds);
    this.schedulerRegistry.addInterval(name, Interval);
  }

  // delete interval
  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.warn(`${name} deleted the interval`);
  }

  // get intervals
  getIntervals() {
    const jobs = this.schedulerRegistry.getIntervals();
    jobs.forEach((key) => {
      this.logger.warn(`Interval: ${key}`);
    });
  }

  // create timeout dynamically
  addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      this.logger.warn(`${name} created timeout`);
    };
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  // delete time out
  deleteTimeout(name) {
    this.schedulerRegistry.deleteTimeout(name);
    this.logger.warn(`${name} timeout deleted!`);
  }
  getTimeout() {
    const jobs = this.schedulerRegistry.getTimeouts();
    jobs.forEach((key) => {
      this.logger.warn(`Timeout: ${key}`);
    });
  }

  async findAll(user: User): Promise<Book[]> {
    const books = await this.bookModel.find({ user }); //  When called without any arguments, this.bookModel.find() fetches all documents in the books collection.
    console.log(books);
    return books;
  }

  async createBook(createBookdto: createBookDto, user: User): Promise<Book> {
    // without any mapper
    const { title, description, author, category, price } = createBookdto;
    // const res = await this.bookModel.create({
    //   title,
    //   description,
    //   price,
    //   author,
    //   category,
    //   user,
    // });
    // return res;
    // without auto mapper
    const book = BookMapper.createMapper(createBookdto);
    console.log(book);
    const res = await this.bookModel.create({ ...book, user });
    console.log(res);
    return res;
    // return book;
    // with auto mapper
    // const book = mapper.map(createBookdto, Book, createBookDto);
    // return book;
  }

  async deleteBook(id: string) {
    return await this.bookModel.findByIdAndDelete(id);
  }
  async getBookById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found!');
    }
    return book;
  }
  async updateBookById(
    id: string,
    updateBookDto: updateBookDto,
  ): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, updateBookDto);
  }

  async generateAllBooksPDF(books: Book[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const data = Buffer.concat(buffers);
        resolve(data);
      });
      doc.on('error', reject);
      doc.fontSize(25).text('Book List', { underline: true });
      doc.moveDown();
      const headers = JSON.parse(process.env.EXCEL_HEADERS);

      books.forEach((book) => {
        Object.keys(headers).map((key) => {
          doc.fontSize(12).text(`${headers[key]}: ${book[`${key}`]}`);
        });
        doc.moveDown();
      });
      doc.end();
    });
  }

  async generateExcelWithId(book: Book) {
    const workBook = new ExcelJS.Workbook();
    const worksheet = workBook.addWorksheet('Book');
    const headers = JSON.parse(process.env.EXCEL_HEADERS);
    worksheet.columns = Object.keys(headers).map((key) => ({
      header: headers[key],
      key,
    }));
    worksheet.addRow({
      title: book.title,
      description: book.description,
      author: book.author,
      price: book.price,
      Category: book.category,
    });
    const buffer = await workBook.xlsx.writeBuffer();
    return buffer;
  }
}
