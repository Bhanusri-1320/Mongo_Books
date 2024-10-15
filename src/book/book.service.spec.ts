// describe('testing', () => {
//   it('testing', () => {
//     expect(true).toEqual(true);
//   });
// });

import { Test } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book, Category } from './schemas/book.schema';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { find } from 'rxjs';

const mockUser = {
  username: 'User',
  id: 'someid',
  password: 'somethings',
  book: [],
};
const mockBook = {
  id: '1',
  title: 'Test Book',
  description: 'Test Description',
  author: 'Test Author',
  category: Category.CRIME,
  price: 20,
  user: mockUser,
};

const mockBookModel = {
  // find: jest.fn().mockReturnValue({
  //   exec: jest.fn().mockResolvedValue([mockBook]), // Ensure exec returns the expected array
  // }),
  find: jest.fn().mockResolvedValueOnce([mockBook]),
  create: jest.fn().mockResolvedValue(mockBook),
  findById: jest.fn().mockResolvedValue(mockBook),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockBook),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockBook),
};

describe('BookService', () => {
  let booksService: BookService;
  let model;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
        {
          provide: SchedulerRegistry, // Mock SchedulerRegistry
          useValue: {},
        },
      ],
    }).compile();
    booksService = module.get(BookService);
    model = module.get(getModelToken(Book.name));
  });
  // testing getall books method
  describe('findAll', () => {
    it('calls bookModel.find and retuns an array of books', async () => {
      model.find.mockResolvedValue('someValue');
      const result = await booksService.findAll(mockUser);
      expect(result).toEqual([mockBook]);
    });
  });
  // testing getby id
  describe('getBookById', () => {
    it('calls the bookmodel.findById and retuns that particular book', async () => {
      model.findById.mockResolvedValue(mockBook);
      const result = await booksService.getBookById('someId');
      expect(result).toEqual(mockBook);
    });
    // negative case
    it('calls the bookmodel.findById and retuns that particular book', async () => {
      model.findById.mockResolvedValue(null);
      expect(booksService.getBookById('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // testing create book method

  describe('createBook', () => {
    it('calls bookmodel.create and retuns the created book', async () => {
      model.create.mockResolvedValue(mockBook);
      const result = await booksService.createBook(mockBook, null);
      expect(result).toEqual(mockBook);
    });
  });
  describe('deleteBook', () => {
    it('calls bookmodel.findByIdAndDelete and returns the result', async () => {
      model.findByIdAndDelete.mockResolvedValue('');
      const result = await booksService.deleteBook('someid');
      expect(result).toEqual('');
    });
  });
  // testing update book by id method
  describe('updateBookById', () => {
    it('calls bookmode.findByIdAndUpdate and return the update book', async () => {
      model.findByIdAndUpdate.mockResolvedValue(mockBook);
      const result = await booksService.updateBookById('someid', mockBook);
      expect(result).toEqual(mockBook);
    });
  });
});
