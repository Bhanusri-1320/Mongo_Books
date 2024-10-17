import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // throw new Error('Method not implemented.');

    // console.log(context.getClass()); // tells in which class the request goes to
    console.log('Before...');
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
      map((data) => data),
      // map((data) => {
      //   let array = [];
      //   data.map((obj, i) => {
      //     const { __v, title, ...newobject } = obj;
      //     console.log(obj.__v);
      //     array.push(newobject);
      //   });
      //   // for (let i; i < data.length; i++) {
      //   //   console.log(`index of ${i} with data[i]`);
      //   // }
      //   // console.log(data[0].__v);
      //   // console.log(array);
      //   // console.log('data', data);
      //   return array;
      // }),
      map((data) => {
        let array = [];
        data.map((obj) => {
          let ob;
          ob = modify(obj);
          array.push(ob);
        });
        return array;
      }),
    );

    function modify(obj) {
      const {
        title,
        description,
        author,
        price,
        user,
        createdAt,
        updatedAt,
        _id,
      } = obj;
      return {
        title,
        description,
        author,
        price,
        user,
        createdAt,
        updatedAt,
        _id,
      };
    }
  }
}

// map--> rxjs--->It takes each emitted value and applies a function to it, returning a new observable with the transformed data.
// tap--> rxjs---> Allows you to perform side effects for notifications from the observable without changing the data.
// pipe--> allows to to transform or manipulate the data, apply filtering, or perform side effects with operators like map, filter, and tap.
// subscribe: Starts the execution of the observable and handles emitted values, errors, and completion.
// forEach: Iterates over emitted values, but it's not as widely used with observables as subscribe
// pipe: Used for preparing and transforming data streams without execution.
// subscribe: Used to execute the observable and handle the emitted values, errors, and completion.
