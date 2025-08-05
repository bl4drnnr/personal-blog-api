import { Transaction } from 'sequelize';
import { UpdateContactPageDto } from '@dto/contact/requests/update-contact-page.dto';
import {
  ContactPageDataDto,
  ContactPageAdminDto
} from '@dto/contact/responses/contact-page-data.dto';

export interface GetContactPageDataInterface {
  (): Promise<ContactPageDataDto>;
}

export interface GetContactPageForAdminInterface {
  (): Promise<ContactPageAdminDto>;
}

export interface UpdateContactPageInterface {
  data: UpdateContactPageDto;
  trx: Transaction;
}
