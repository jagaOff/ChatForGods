import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  constructor() {
    super();
  }

  override handleError(error: any) {
     console.error('Error from global error handler', error);
     // Add any additional logic here
  }
}
