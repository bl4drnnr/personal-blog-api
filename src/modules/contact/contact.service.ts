import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ContactInterface } from '@interfaces/contact.interface';
import { EmailService } from '@shared/email.service';
import { ContactedDto } from '@dto/contacted.dto';

@Injectable()
export class ContactService {
  constructor(
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService
  ) {}

  async contact({ payload }: ContactInterface) {
    const { name, message, email } = payload;

    await this.emailService.contact({ name, message, email });

    return new ContactedDto();
  }
}
