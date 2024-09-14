import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ContactService } from '@modules/contact.service';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ContactDto } from '@dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UsePipes(ValidationPipe)
  @Post('contact')
  contact(@Body() payload: ContactDto) {
    return this.contactService.contact({ payload });
  }
}
