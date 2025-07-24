import { Injectable } from '@nestjs/common';

@Injectable()
export class ControlService {
  getHealthCheck() {
    return { message: 'success' };
  }
}
