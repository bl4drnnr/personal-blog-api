import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Copyright } from '@models/copyright.model';
import { UpdateCopyrightDataDto } from '@dto/update-copyright-data.dto';

@Injectable()
export class CopyrightService {
  constructor(@InjectModel(Copyright) private copyrightModel: typeof Copyright) {}

  async getCopyrightData() {
    const copyright = await this.findCopyrightOrFail();

    return {
      copyrightEmail: copyright.copyrightEmail,
      copyrightText: copyright.copyrightText,
      copyrightLinks: copyright.copyrightLinks
    };
  }

  async getCopyrightDataAdmin() {
    const copyright = await this.findCopyrightOrFail();

    return {
      copyrightEmail: copyright.copyrightEmail,
      copyrightText: copyright.copyrightText,
      copyrightLinks: copyright.copyrightLinks
    };
  }

  async updateCopyrightData(data: UpdateCopyrightDataDto) {
    let copyright = await this.copyrightModel.findOne();

    if (!copyright) {
      copyright = await this.copyrightModel.create(data);
    } else {
      await copyright.update(data);
    }

    return copyright;
  }

  private async findCopyrightOrFail() {
    const copyright = await this.copyrightModel.findOne();

    if (!copyright) {
      throw new Error('Copyright data not found');
    }

    return copyright;
  }
}
