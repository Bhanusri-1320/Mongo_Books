/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    const books = await this.bookModel.find(); //  When called without any arguments, this.bookModel.find() fetches all documents in the books collection.
    return books;
  }

  async createBook(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);
    return res;
  }

  async deleteBook(id: string) {
    console.log(id);
    return await this.bookModel.findByIdAndDelete(id);
  }
  async getBookById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found!');
    }
    return book;
  }
  async updateBookById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Book');
    const headers = JSON.parse(process.env.EXCEL_HEADERS);

    worksheet.columns = Object.keys(headers).map((key) => ({
      header: headers[key],
      key,
    }));

    // adding rows
    worksheet.addRow({
      title: book.title,
      description: book.description,
      author: book.author,
      price: book.price,
      category: book.category,
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
