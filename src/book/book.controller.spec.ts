import { Test } from '@nestjs/testing';
import { BookController } from './book.controller';
import { getModelToken } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('BookController', () => {
  let booksController: BookController;
  let booksService;
  const mockBookService = {};
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookController,
        {
          provide: BookService,
          useValue: { mockBookService },
        },
        {
          provide: SchedulerRegistry,
          useValue: {},
        },
      ],
    }).compile();
    booksController = module.get(BookController);
    booksService = module.get(BookService);
  });

//   describe('test', () => {
//     it('testing test', async () => {
//       expect(true).toEqual(true);
//     });
//   });
});
