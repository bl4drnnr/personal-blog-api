import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(messages: any) {
    super(JSON.stringify(messages));
  }
}
